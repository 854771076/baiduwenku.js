// ==UserScript==
// @name         百度文库
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wenku.baidu.com/view/*
// @match        https://wenku.baidu.com/view/*.html
// @icon         data:image/ico https://edu-wenku.bdimg.com/v1/pc/2020%E6%96%B0%E9%A6%96%E9%A1%B5/wenku-header-icon.ico
// @grant        none
// ==/UserScript==

(function() {

    var addDownloader=()=>{
        let div=document.querySelector('#app')
        let newchild=document.createElement('div')
        newchild.setAttribute('class','Download')
        newchild.setAttribute('style','position:absolute;top:100px;color:black;width:80px;height:40px;line-height:40px;text-align: center;background-color:#d3d3d3;z-index:200;cursor: pointer;')
        newchild.innerHTML='解析文档'
        newchild.addEventListener('mouseover',function(){
        newchild.style.backgroundColor='orange'
        newchild.style.color='white'
        })
        newchild.addEventListener('mouseleave',function(){
        newchild.style.backgroundColor='#d3d3d3'
        newchild.style.color='black'
        })
        newchild.addEventListener('click',function(){
            //注释
            console.log(pageData.readerInfo.htmlUrls)
            parser(pageData.readerInfo.htmlUrls,pageData.viewBiz.docInfo.fileType)
        })
        div.appendChild(newchild)
        console.log(div)
    }
    var parser=(json,type)=>{
        let page=0
        var maxpage
        if(type!='ppt'){
            maxpage=json.json.length
        }
        else{
            maxpage=json.length
        }
        let div=document.querySelector('#app')
        let newchild=document.createElement('div')
        newchild.setAttribute('class','Parser')
        newchild.setAttribute('style','position:absolute;top:10%;left:10%;color:black;width:80%;height:80vh;background-color:#f1f1f1;z-index:2000;border-radius: 10px;')
        newchild.innerHTML='<div id="close" style="position:absolute;top:0px;right:0px;width: 25px;height:25px;border-radius: 25px;background-color: white;line-height:25px;text-align:center">x</div><a id="prepage" href="javascript:;" style="position:absolute;background-color:rgba(0,0,0,0.3);width:45px;height:150px;top:calc(50% - 75px);line-height:150px;color:white;text-align: center;text-decoration: none;"><</a><a id="nextpage" href="javascript:;" style="position:absolute;background-color:rgba(0,0,0,0.3);width:45px;height:150px;top:calc(50% - 75px);left:calc(100% - 45px);line-height:150px;color:white;text-align: center;text-decoration: none;">></a>'
        let as=newchild.querySelectorAll('a')
        //初始化

        let content=document.createElement('div')
        content.setAttribute('id','content')
        content.setAttribute('style','width:99%;height:100%;padding:30px 100px;overflow: auto;box-sizing: border-box;')
        //初始化翻页条
        for(let i=0;i<as.length;i++){
        as[i].addEventListener('mouseover',function(){
        this.style.backgroundColor='rgba(0,0,0,0.6)'
        })
        as[i].addEventListener('mouseleave',function(){
        this.style.backgroundColor='rgba(0,0,0,0.3)'
        })
        }
        as[0].addEventListener('click',function(){
            page-=1
            if(page<0){
            page=0
            alert('无上一页啦！')
            }
            getinner(json,page,type)
            console.log('上一页')
        })
        as[1].addEventListener('click',function(){
            page+=1
            if(page>maxpage-1){
            page=maxpage-1
            alert('无下一页啦！')
            }
            getinner(json,page,type)
            console.log('下一页')

        })
        let close=newchild.querySelector('#close')
        close.addEventListener('mouseover',function(){
            this.style.backgroundColor='#e81123'
        })
        close.addEventListener('mouseleave',function(){
            this.style.backgroundColor='white'
        })
        close.addEventListener('click',function(){
            document.querySelector('.Parser').style.display='none'

        })
        if (!document.querySelector('#content')){

            newchild.appendChild(content)
            div.appendChild(newchild)


        }
        document.querySelector('.Parser').style.display='block'
        getinner(json,page,type)
    }

    var getinner=(json,page,type)=>{
        var innerHTML=''
        if(type=='excel'){
            $.ajax({
                type: "GET",
                url: json.json[page].pageLoadUrl,
                contentType: 'application/Javascript',
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback:"wenku_"+(page+1),
                crossDomain: true,
                headers: {'Access-Control-Allow-Origin':'*'},
                timeout: 1000,
                success: function (result) {
                    console.log(result)
                    let flag=0
                    for(var i=0;i<result.body.length;i++){
                        if(result.body[i].c==' '||result.body[i].c instanceof Object){
                            if(!flag){
                            innerHTML+='<br>'
                                flag=1
                            }

                        }else{
                            innerHTML+=String(result.body[i].c)
                            flag=0
                        }

                    }
                    document.querySelector('#content').innerHTML=innerHTML
                },
                error: function (result) {
                    console.error("error");
                    console.error(result);
                }

            })
        }
        else if(type=='word' || type=='pdf'){
            $.ajax({
                type: "GET",
                url: json.json[page].pageLoadUrl,
                contentType: 'application/Javascript',
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback:"wenku_"+(page+1),
                crossDomain: true,
                headers: {'Access-Control-Allow-Origin':'*'},
                timeout: 1000,
                success: function (result) {
                    console.log(result)
                    let flag=0
                    for(var i=0;i<result.body.length;i++){
                        if(result.body[i].c==' '||result.body[i].c instanceof Object){
                            if(!flag){
                            innerHTML+='<br>'
                                flag=1
                            }

                        }else{
                            innerHTML+=String(result.body[i].c)
                            flag=0
                        }

                    }
                    document.querySelector('#content').innerHTML=innerHTML
                },
                error: function (result) {
                    console.error("error");
                    console.error(result);
                }

            })

        }else if(type=='ppt'){
            let url=json[page]
            let innerHTML='<img src="'+url+'" style="width: 100%;height:100%;">'
            document.querySelector('#content').innerHTML=innerHTML

        }else{
            innerHTML='暂无解析！'
        }

        return innerHTML
    }
    
    var main=()=>{
        addDownloader()
        
    }
    main()
})();
