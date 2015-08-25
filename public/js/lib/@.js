var dropdown = require('./dropdown');

var instance = function(ele, usernames){
    init(ele, usernames);
}

var setVal = function(ipt, name){
    var val = ipt.val();
    var lastIndex = val.lastIndexOf('@');
    val = val.slice(0, lastIndex + 1);

    ipt.val(val + name + ' ');
    oc.dropdown.remove(ipt);
    ipt.focus();
}

var init = function(ele, usernames){
    var iptComment = $(ele);
    
    iptComment.on('input', function(){
        oc.dropdown.remove(iptComment);
        var val = this.value;
        var macthed = /([\S*|\s]?@[\S]*$)/g.test(val);
        if(macthed){
            var lastIndex = val.lastIndexOf('@') + 1;
            var searchStr = val.slice(lastIndex).toLowerCase();
            var div = $('<div class="zAt"></div>');
            for(var i = 0; i < usernames.length; i ++){
                var username = usernames[i];
                if(username.indexOf(searchStr) === 0){
                    div.append('<p>' + username + '</p>');
                }
            }
            
            if(div.find('>p').length > 0){
                oc.dropdown.show(iptComment, "", div, "down");
            }

            div.on('click', '>p', function(){
                setVal(iptComment, this.innerHTML);
            })
        }
    })
    .on('keydown', function(e){
        var slc = iptComment.data('zTarget');

        if(e.keyCode === 13 && slc.find('p.active').length > 0){
            setVal(iptComment, slc.find('p.active').html());

            event.preventDefault();
            return false;
        }
    })
    .on('keyup', function(e){
        var slc = iptComment.data('zTarget');
        if(!slc){
            return;
        }
        var dropBd = slc.find('.zDropdownBd');

        if(e.keyCode === 40){
            var focusP = slc.find('p.active');
            if(focusP.length === 0){
                slc.find('p:eq(0)').addClass('active');
            }
            else{
                var next = focusP.next('p');
                if(next.length > 0){
                    next.addClass('active');
                    focusP.removeClass('active');
                    
                    var top = next.position().top + dropBd.scrollTop() + 34 - slc.height();
                    top > 0 && dropBd.scrollTop(top);
                }
            }
            e.preventDefault();
            return;
        }
        if(e.keyCode === 38){
            e.stopPropagation();
            var focusP = slc.find('.active');
            if(focusP.length === 0){
                e.preventDefault();
                return;
            }
            
            var prev = focusP.prev('p');
            if(prev.length > 0){
                prev.addClass('active');
                focusP.removeClass('active');

                prev.position().top < 0 && dropBd.scrollTop(dropBd.scrollTop() + prev.position().top);
            }
            e.preventDefault();
            return;
        }
    })
    .on('blur', function(){
        setTimeout(function(){
            oc.dropdown.remove(iptComment);
        }, 200);
    });
}

module.exports = instance;

// UI.@ = function(ele, array, cb, prefix){
//     ele = $(ele);
//     if(typeof array === 'function'){
//         cb = array;
//         array = null;
//     }
//     ele.off('keyup').off('keydown').off('blur');
//     ele.on('keydown', function(e){
//         var ipt = $(this);
//         var ul = ipt.next('ul.zAutoComplete');
//         if(e.keyCode === 13 && ul.find('li.active').length > 0){
//             event.preventDefault();
//             return false;
//         }
//     })
//     ele.on('keyup', function(e){
//         var ipt = $(this);
//         var ul = ipt.next('ul.zAutoComplete');

//         if(e.keyCode === 40){
//             var focusLi = ul.find('li.active');
//             if(focusLi.length === 0){
//                 ul.find('li:eq(0)').addClass('active');
//             }
//             else{
//                 var nextLi = focusLi.next('li');
//                 if(nextLi.length > 0){
//                     nextLi.addClass('active');
//                     focusLi.removeClass('active');
//                 }
//             }

//             return;
//         }
//         if(e.keyCode === 38){
//             var focusLi = ul.find('li.active');
//             if(focusLi.length === 0){
//                 return;
//             }
            
//             var prevLi = focusLi.prev('li');
//             if(prevLi.length > 0){
//                 prevLi.addClass('active');
//                 focusLi.removeClass('active');
//             }

//             return;
//         }

//         if(e.keyCode === 13){
//             var focusLi = ul.find('li.active');
//             if(focusLi.length > 0){
//                 var slcVal = focusLi.html();
//                 var text = ipt.val();
//                 // val = val.replace(/.*;|.*,|.*\s/g, '');
//                 if(prefix){
//                     var mathedArray = text.match(/(.|,|\s)*(;|,|\s)/);
//                     text = '';
//                     if(mathedArray && mathedArray.length > 0){
//                         text = mathedArray[0];
//                     }
//                     ipt.val(text + slcVal);
//                 }
//                 else{
//                     ipt.val(slcVal);
//                 }
                
//                 ul.remove();
//                 cb && cb(slcVal, ipt);
//             }
//             return;
//         }
        
//         var source = array;
//         if(!array){
//             var sourceString = ipt.attr('data-source');
//             if(sourceString){
//                 source = eval(sourceString);
//             }
//             else{
//                 source = ipt.data('source');
//             }
//         }
//         if(!source){
//             return;
//         }

//         $('.zAutoComplete').remove();
//         var val = $.trim(this.value);
//         if(prefix){
//             val = val.replace(/.*;|.*,|.*\s/g, '');
//         }
//         if(!val){

//             return;
//         }
//         var matchedArray = source.filter(function(item){
//             return item.toUpperCase().indexOf(val.toUpperCase()) > -1;
//         });
        
//         var len = matchedArray.length;
//         if(len === 0) {

//             return;
//         }

//         if(len > 8){
//             len = 8;
//         }

//         var ul = $('<ul class="zAutoComplete"></ul>');
//         for(var i = 0; i < len; i++){
//             ul.append('<li tabindex="0">' + matchedArray[i] + '</li>');
//         }
//         var top = ipt.position().top + ipt.outerHeight();
//         var left = ipt.position().left;
//         ul.css({top: top, left: left}).on('click', 'li', function(){
//             var slc = $(this).html();
//             // ipt.val(slc);
//             var text = ipt.val();
//             if(prefix){
//                 var mathedArray = text.match(/(.|,|\s)*(;|,|\s)/);
//                 text = '';
//                 if(mathedArray && mathedArray.length > 0){
//                     text = mathedArray[0];
//                 }
//                 // text = text.replace(text.replace(/.*;|.*,|.*\s/g, ''), '');
//                 ipt.val(text + slc);
//             }
//             else{
//                 ipt.val(slc);
//             }
//             $('.zAutoComplete').remove();
//             cb && cb(slc, ipt);
//         })
//         .on('mouseenter', 'li', function(){
//             ul.find('.active').removeClass('active');
//             $(this).addClass('active');
//         })
        
//         ipt.after(ul);

//     }).on('blur', function(){
//         setTimeout(function(){
//             $('.zAutoComplete').remove();
//         }, 200);
//     });
// }
