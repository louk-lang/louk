module.exports = {
    generateHTML: generateHTML
}

const _ = require("underscore")

//Turns the completed array of element objects into raw HTML
function generateHTML(input, options){
    const content = input
    let html = ""

    var keepWhitespace = true

    if(options && options.whitespace !=null){
        keepWhitespace = options.whitespace
    }

    for(let index = 0; index < content.length; index++){
        let value = content[index]

        //HTML is passed straight through
        if(value.lineType == "html"){

            if(keepWhitespace){
                html = html + value.raw

                //Insert a newline as long as we're not at the last line.
                if(index < (content.length - 1)){
                    html = html + "\n"
                }
            }
            else{
                html = html + value.unindented
            }
        }

        //Comments are discarded
        else if(value.lineType == "comment"){
            html = html
        }

        //Passthrough content (such as scripts or CSS) aren't processed
        else if(value.passthrough == true){
            html = html + "\n" + value.raw
        }

        //Louk notation goes through additional processing
        else{
            //Generate opening tags
            if(value.position == "opening" && value.key != null){

                if(keepWhitespace && value.whitespace){
                    html = html + value.whitespace
                }

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

                    //If the attribute is boolean, no explicit value is needed
                    if(value.directiveType != "boolean" && value.data){
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
                else{
                    if(keepWhitespace && value.containsElement){
                        html = html +  "\n"
                    }
                }

            }
            //Generate closing tags
            else if(value.position == "closing" && value.key != null){

                if(keepWhitespace && value.containsElement && value.whitespace){
                    html = html + value.whitespace
                }

                html = html + "</" + value.key + ">"

                //Add a return if we're not at the last element.
                if(keepWhitespace && index < (content.length - 1)){
                    html = html +  "\n"
                }
            }
        }
    }
    return html
}

function generateWhitespace(indent){
    var indentation = ""
    for(var i = 0; i < indent; i++){
        indentation = indentation + "\t"
    }
    return indentation
}
