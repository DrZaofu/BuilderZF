let mcsys
let Builders = document.getElementById("Builder_list")
let settings = document.getElementById("Builder_settings")
let close = document.getElementById("close")
close.onclick = function (e) {
    send("BuilderZF:close_UI")
}
engine.on("facet:updated:core.scripting", function (interface) {
    mcsys = interface;
});
engine.trigger("facet:request", ["core.scripting"]);
function send(message) {
    mcsys.triggerEvent(JSON.stringify(message))
}
engine.on("BuilderZF:flush", function (element) {
    Builders.innerHTML = ""
    let data = JSON.parse(element)
    data == {
        "Builders": {
            "example_Builder1": {
                "name": "这是一个简单的Builder",
                "info": "这是第一个Builder",
                "settings": {
                    "example_setting1": "teesy",
                    "example_setting2": [1,2,3]
                }
            }, 
            "example_Builder2": {
                "name": "这是另一个简单的Builder",
                "info": "这是第一个Builder",
                "settings": {
                    "example_setting1": 5,
                    "example_setting2": true
                }
            }, 
            "example_Builder3": {
                "name": "这里的名字可以重复",
                "info": "这是第一个Builder",
                "settings": {
                    "能看到吗": undefined,
                    "example_setting2": 1
                }
            }
        }
    }
    let tmp_button
    for (let i = 0; i < Object.keys(data.Builders).length; i++) {//遍历
        tmp_button = document.createElement("button")
        tmp_button.onclick = Builder_list_click
        tmp_button.className = "Builder_list_button_normal"
        tmp_button.id = Object.keys(data.Builders)[i]
        tmp_button.data = data.Builders[Object.keys(data.Builders)[i]]
        tmp_button.innerHTML = data.Builders[Object.keys(data.Builders)[i]].name
        Builders.appendChild(tmp_button)
    }
})
function Builder_list_click(e) {
    Array.prototype.filter.call(Builders.getElementsByClassName("Builder_list_button_light"),function (element) {element.className = "Builder_list_button_normal"})
    e.path[0].className = "Builder_list_button_light"
    settings.innerHTML = ""
    let box
    let text
    let tmp_setting
    let info = document.createElement("div")
    info.innerHTML = e.path[0].data.info
    info.className = "Builder_info"
    settings.appendChild(info)
    for (let i = 0; i < Object.keys(e.path[0].data.settings).length; i++) {
        tmp_setting = document.createElement("div")
        text = document.createElement("div")
        text.innerHTML = Object.keys(e.path[0].data.settings)[i]
        text.className = ""
        tmp_setting.appendChild(text)
        set = document.createElement("div")
        set.className = ""
        switch (typeof e.path[0].data.settings[Object.keys(e.path[0].data.settings)[i]]) {
            case "object"://Array
                if (e.path[0].data.settings[Object.keys(e.path[0].data.settings)[i]] instanceof Array){
                    box = document.createElement("select")
                    e.path[0].data.settings[Object.keys(e.path[0].data.settings)[i]].forEach(element => {
                        let tmp_option = document.createElement("option")
                        tmp_option.value = element
                        tmp_option.innerHTML = element
                        box.appendChild(tmp_option)
                    });
                } else {
                    box = document.createElement("div")
                }
                break
            case "boolean":
                box = document.createElement("input")
                box.type = "checkbox"
                box.checked = e.path[0].data.settings[Object.keys(e.path[0].data.settings)[i]]
                break
            case "number":
                box = document.createElement("input")
                box.type = "number"
                box.innerHTML = e.path[0].data.settings[Object.keys(e.path[0].data.settings)[i]]
                break
            case "string":
                box = document.createElement("textarea")
                box.innerHTML = e.path[0].data.settings[Object.keys(e.path[0].data.settings)[i]]
                break
            default:
                box = document.createElement("div")
                break
        }
        box.className = "box"
        set.appendChild(box)
        tmp_setting.appendChild(set)
        settings.appendChild(tmp_setting)
    }
}