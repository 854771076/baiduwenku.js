// ==UserScript==
// @name         百度文库
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wenku.baidu.com/view/*
// @match        https://wenku.baidu.com/view/*.html
// @icon         https://edu-wenku.bdimg.com/v1/pc/2020%E6%96%B0%E9%A6%96%E9%A1%B5/wenku-header-icon.ico
// @grant        none
// ==/UserScript==

(function() {

    var Downloader=()=>{
        let div=document.querySelector('#app')
        //添加解析文档按钮
        let newchild=document.createElement('div')
        newchild.setAttribute('class','Download')
        newchild.setAttribute('style','position:absolute;top:100px;color:black;width:80px;height:40px;line-height:40px;text-align: center;background-color:#d3d3d3;z-index:200;cursor: pointer;box-shadow: 0 0 22px 0 rgba(0,7,24,.08);')
        newchild.innerHTML='解析文档'
        //按钮事件
        newchild.addEventListener('mouseover',function(){
        newchild.style.backgroundColor='orange'
        newchild.style.color='white'
        })
        newchild.addEventListener('mouseleave',function(){
        newchild.style.backgroundColor='#d3d3d3'
        newchild.style.color='black'
        })
        newchild.addEventListener('click',function(){
            console.log(pageData.readerInfo.htmlUrls)
            parser(pageData.readerInfo.htmlUrls,pageData.viewBiz.docInfo.fileType)
        })
        //插入按钮
        div.appendChild(newchild)
    }
    //解析json函数
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
        //添加解析器元素
        let newchild=document.createElement('div')
        newchild.setAttribute('class','Parser')
        newchild.setAttribute('style','position:absolute;top:10%;left:10%;color:black;width:80%;height:80vh;background-color:#f7f7f7;z-index:2000;border-radius: 10px;font-size:15px;line-height:40px;box-shadow: 0 0 22px 0 rgba(0,7,24,.08);')
        let c='<div id="close" style="position:absolute;top:0px;right:0px;width: 25px;height:25px;border-radius: 25px;background-color: white;line-height:25px;text-align:center">x</div><a id="prepage" href="javascript:;" style="position:absolute;background-color:rgba(0,0,0,0.3);width:45px;height:150px;top:calc(50% - 75px);line-height:150px;color:white;text-align: center;text-decoration: none;"><</a><a id="nextpage" href="javascript:;" style="position:absolute;background-color:rgba(0,0,0,0.3);width:45px;height:150px;top:calc(50% - 75px);left:calc(100% - 45px);line-height:150px;color:white;text-align: center;text-decoration: none;">></a>'
        newchild.innerHTML=c
        let as=newchild.querySelectorAll('a')
        //添加内容元素
        let content=document.createElement('div')
        content.setAttribute('id','content')
        content.setAttribute('style','width:99%;height:100%;padding:30px 100px;overflow: auto;box-sizing: border-box;')
        //初始化翻页条事件
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
        //关闭按钮事件
        let close=newchild.querySelector('#close')
        close.addEventListener('mouseover',function(){
            this.style.backgroundColor='#e81123'
            this.style.cursor='pointer'
        })
        close.addEventListener('mouseleave',function(){
            this.style.backgroundColor='white'
            this.style.cursor='pointer'
        })
        close.addEventListener('click',function(){
            page=0
            var p=document.querySelector('.Parser')
            div.removeChild(p)

        })
        if (!document.querySelector('.Parser')){
            newchild.appendChild(content)
            div.appendChild(newchild)
        }
        getinner(json,page,type)
    }

    var getinner=(json,page,type)=>{
        var imglist=json.png
        if (page==0){
            var imgindex=0
            var imgflag=0
        }
        //显示页码
        var innerHTML='<div style="position:absolute;bottom:0px;right:50%;z-index=200">'+(page+1)+'</div>'
        if(type=='word' || type=='pdf'||type=='txt'||type=='excel'){
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
                        if(result.body[i].c==' '){
                            if(!flag){
                                innerHTML+='<br>'
                                flag=1
                            }

                        }else if(result.body[i].c instanceof Object ){
                            console.log(imglist)
                            console.log(imgindex)
                            if(imgindex<imglist.length-1 && imgflag==0){
                                innerHTML+='<br><img src="'+imglist[imgindex].pageLoadUrl+'"style="width:50%;margin:0 auto;display:block"></img><br>'
                                imgindex++

                            }
                            if(imgindex==imglist.length-1){
                            imgflag=1
                            }

                        }
                        else{
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
            innerHTML+='<img src="'+url+'" style="width: 100%;height:98%;">'
            document.querySelector('#content').innerHTML=innerHTML

        }else{
            innerHTML='暂无解析！'
        }

        return innerHTML
    }
    Downloader()
})();
