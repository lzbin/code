// JavaScript Document
$(function(){
    $('#yanshi>a').on('click', function(){
        var othis = $(this), index = othis.index();
        switch(index){
            case 0:
                var icon = 0;
                (function changeIcon(){
                    var idxs = jeBox.alert('Hi，你好！ 点击确定更换图标', {
                        icon: icon,
                        maskClose: true,
                        title: icon === 0 ? '初体验 - jeBox 1.0' : 'icon：'+icon + ' - jeBox 1.0'
                    }, function(idx){
                        jeBox.close(idx);
                        changeIcon();
                    });
                    if(9 === ++icon) jeBox.close(idxs);
                }());
                break;
            case 1:
                jeBox.open({
                    cell:"jbx",
                    title:"你的选择",
                    area:["400px","150px"],
                    content:'您是如何看待前端开发？',
                    masklock : true ,
                    scrollbar: false,
                    button: [ {name: '重要'},{name: '奇葩'}],
                    yesfun: function(index){
                        jeBox.msg('的确很重要', {icon: 2,time:2});
                        jeBox.close(index);
                    },
                    nofun:function(){
                        jeBox.msg('也可以这样认为', {icon: 1,time:10,button:[{name:"确定"},{name:"取消"}]});
                    }
                })

                break;
            case 2:
                jeBox.msg('我就是要提示！');
                break;
            case 3:
                jeBox.open({
                    area:["400px","240px"],
                    content:'<div style="padding:20px;">即直接给content传入html字符<br>当内容宽高超过定义宽高，会自动出现滚动条。<br><br><br><br><br><br><br><br><br><br><br>很高兴在下面遇见你</div>',
                    masklock : true
                })
                break;
            case 4:
                jeBox.open({
                    area:["400px","250px"],
                    content: document.getElementById("notice"),
                    masklock : true
                })
                break;
            case 5:
                jeBox.open({
                    title:"mBox mobile页",
                    type:2,
                    padding:"0",
                    area:["450px","80%"],
                    content: "http://www.jayui.com/mbox/",
                    masklock : true
                })
                break;
            case 6:
                jeBox.open({
                    title:"很多时候，我们想最大化看，比如像这个页面",
                    type:2,
                    maxBtn:true,
                    padding:"0",
                    area:["80%","80%"],
                    content: ["http://www.jayui.com/","no"],
                    masklock : true
                })
                break;
            case 7:
                var er = jeBox.loading(1,"玩命加载中");
                setTimeout(function(){
                    jeBox.close(er)
                }, 5000);
                break;
            case 8:
                var san = jeBox.loading(2,"Loading...");
                setTimeout(function(){
                    jeBox.close(san)
                }, 5000);
                break;
        }
    })

    $('.infor>a').on('click', function(){
        var othis = $(this), index = othis.index();
        switch(index){
            case 0:
                jeBox.alert('见到你真的很高兴', {icon: 7});
                break;
            case 1:
                jeBox.msg('你确定你很帅么？', {
                    time: 0 ,
                    button: [ {name: '必须啊'},{name: '丑到爆'}],
                    boxStyle:{background:"#333",  border:"1px solid #333", "border-radius":"4px", color:"#fff",opacity:"0.93", filter:"alpha(opacity=90)"},
                    yesfun: function(index){
                        jeBox.close(index);
                        jeBox.msg('雅蠛蝶 O.o', { icon: 7 });
                    }
                });
                break;
            case 2:
                jeBox.msg('这是最常用的吧');
                break;
            case 3:
                jeBox.msg('不开心。。', {icon: 6});
                break;
        }
    })

    $('.pageiframe>a').on('click', function(){
        var othis = $(this), index = othis.index();
        switch(index){
            case 0:
                jeBox.open({
                    title:false,
                    closeBtn:false,
                    maskClose:true,
                    area:["450px","250px"],
                    content: "自定义HTML内容",
                    boxStyle:{background:"#81BA25",  border:"1px solid #81BA25", "border-radius":"4px", color:"#fff"}
                })
                break;
            case 1:
                jeBox.open({
                    type: 2,
                    area: ['700px', '530px'],
                    maxBtn: true,
                    scrollbar: false,
                    content: 'iframe.html'
                });
                break;
            case 2:
                jeBox.open({
                    title:false,
                    closeBtn:false,
                    type:2,
                    padding:"0",
                    area:['630px', '360px'],
                    content: "http://player.youku.com/embed/XMTI4MTE1NTY0MA",
                    maskClose:true
                })
                jeBox.msg('点击任意处关闭');
                break;
            case 3:
                jeBox.open({
                    title:"禁滚动条",
                    type:2,
                    padding:"0",
                    area:["450px","80%"],
                    content: ["http://www.jayui.com/mbox/","no"],
                    masklock : true
                })
                break;
        }
    })

    $('.jeloading>a').on('click', function(){
        var othis = $(this), index = othis.index();
        switch(index){
            case 0:
                var one = jeBox.loading(1);
                setTimeout(function(){
                    jeBox.close(one)
                }, 3000);
                break;
            case 1:
                jeBox.loading(1,"玩命加载中",{time:3});
                break;
            case 2:
                jeBox.loading(2,"加载中...",{time:3});
                break;
            case 3:
                jeBox.loading(3,"Loading...",{time:3});
                break;
        }
    })

})
