module.exports = {
    generateHTML: generateHTML
}

const _ = require("underscore")

//Turns the completed array of element objects into raw HTML
function generateHTML(input, options){

    const content = input
    let html = ""

    for(let index = 0; index < content.length; index++){
        let value = content[index]

        //HTML is passed straight through
        if(value.lineType == "html"){
            html = html + value.unindented
        }

        //Comments are discarded
        else if(value.lineType == "comment"){
            html = html
        }

        //Louk notation goes through additional processing
        else{
            //Generate opening tags
            if(value.position == "opening" && value.key != null){

                html = html + "<"
                html = html + value.key

                //Loop over all of the element's attributes
                _.each(value.attributes, function(value, key){
                    let attribute = ""

                    //If the attribute should be interpretted dynamically...
                    if(value.interpretation == "dynamic"){
                        if(value.directiveType == "boolean"){
                            attribute = "v-" + key
                        }
                        else if(value.directiveType == "simple"){
                            attribute = "v-" + key
                        }
                        else if(value.directiveType == "action"){
                            attribute = "v-on:" + key
                        }
                        else if(value.directiveType == "bind"){
                            attribute = "v-bind:" + key
                        }
                    }

                    //If the attribute should be interpretted statically...
                    else if(value.interpretation == "static"){
                        attribute = key
                    }

                    //Put the above defined attribute and value into the HTML
                    html = html + " " + attribute

                    //If the directive is boolean, no explicit value is needed
                    if(value.directiveType != "boolean"){
                        html = html + "=\"" + value.data + "\""
                    }
                })

                if(value.selfClosing){
                    html = html + " /"
                }
                html = html + ">"

                //If there's body content...
                if(value.fill){

                        //If the body should be interpreted dynamically, we wrap it in Vue curly brackets
                        if(value.interpretation == "dynamic"){
                            html = html + "{{" + value.fill + "}}"
                        }

                        //Otherwise we just include it straight.
                        else if(value.interpretation == "static"){
                            html = html + value.fill
                        }
                    }

            }

            //Generate closing tags
            else if(value.position == "closing" && value.key != null){
                html = html + "</" + value.key + ">"
            }
        }
    }
    return html
}
