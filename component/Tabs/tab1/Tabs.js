(function(){
    function TabView() {
        this.tabs = [];
        this.panels = [];
        this.eventName = "";
    }

    TabView.prototype.init = function (eventName,onFocusClassName){
        var tabs = this.tabs;
        var panels = this.panels;
        eventName = eventName || "mouSEOver";
        for(var i=0; i<tabs.length; i++)
        {
            tabs[i].key = i
            tabs[i]["on"+eventName] = function(){
                //clear tabs
                for(var j = 0; j<tabs.length;j++)
                {
                    tabs[j].className = tabs[j].className.replace(eval("/ ?"+onFocusClassName+" ?/"),"");
                }

                //clear panels
                for(var j =0 ;j<panels.length;j++){
                    panels[j].style.display = "none";
                }

                //set
                this.className += " "+ onFocusClassName;
                panels[this.key].style.display = "block"
            }
        }
    };
    window.TabView = TabView;
})();