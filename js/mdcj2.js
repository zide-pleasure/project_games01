/**
 * Created by fangzide on 2016/11/23.
 */





function request(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof(returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}
var token = request("token");

//请求魔豆数量
function getCunut() {

    $.post(
        'url' + 'account/get/credit',
        {
            token: token
        },
        function (data) {
            var data = $.parseJSON(data);
            console.log("返回的积分：" + JSON.stringify(data));
            lottery.mount = data.data.usable;
            // lottery.amount = data.data.usable;

            $('#total').text(lottery.mount);
            // $('#win').text(lottery.amount);
        });
    $.post(
        'url' + 'convert/get/luck/list',
        {
            token: token
        },
        function (data) {
            var data = $.parseJSON(data);
            console.log("返回的积分：" + JSON.stringify(data));
            // lottery.mount = data.data.usable;
            lottery.amount = data.data.total;

            //$('#total').text(lottery.mount);
            $('#win').text(lottery.amount);
        });


}

addLoadEvent(sizee)
addLoadEvent(chouj)
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    }
    else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}
function sizee() {
    // alert('dl')
    var obj = $("#drawBtn")[0];//jquery对象转化为dom对象
    console.log(obj.clientWidth + "," + obj.clientHeight);
    $('.pic').height(obj.clientHeight + 'px')

}
var lottery = {
    index: 0,	//当前转动到哪个位置，起点位置
    count: 0,	//总共有多少个位置
    timer: 0,	//setTimeout的ID，用clearTimeout清除
    speed: 2,	//初始转动速度
    times: 0,	//转动次数
    cycle: 60,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1,	//中奖位置
    mount: 0,    //魔豆数量
    amount: 0,    //奖品数量
    datanum: 1000, //getData抽奖获取
    goodsArry: ['27', '28', '29', '30', '31', '32', '33', '34'],
    init: function (id) {
        getCunut()
        if ($("#" + id).find(".lottery-unit").length > 0) {
            console.log($("#" + id).find(".lottery-unit"))
            // alert("asd")
            $lottery = $("#" + id);
            $units = $lottery.find(".lottery-unit");
            this.obj = $lottery;
            this.count = $units.length;
            $lottery.find(".lottery-unit-" + this.index).addClass("active");
        }
        ;
    },
    roll: function () {
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find(".lottery-unit-" + index).removeClass("active");
        index += 1;
        if (index > count - 1) {
            index = 0;
        }
        ;
        $(lottery).find(".lottery-unit-" + index).addClass("active");
        this.index = index;
        return false;
    },
    stop: function (index) {
        this.prize = index;
        return false;
    },
    callback: function (index) {
        var lottery = this.obj;
        // $(lottery).find(".lottery-"+index).html()
        console.log($(lottery).find(".lottery-" + index).html()) //中奖的内容
        setTimeout(function () {
            $('#goodstext').html($(lottery).find(".lottery-" + index).html())
            $('#mask').show()
            // alert($(lottery).find(".lottery-"+index).html())
            var switchs = true;
            $('#mask_close').click(function () {
                if (switchs) {
                    // alert("领取成功")
                    layer.open({
                        content: '恭喜您,领取成功'
                        , skin: 'msg'
                        , time: 3
                    });
                    $('#mask').hide()
                    switchs = false;
                }

            })
        }, 1200);

    },
    getData: function () {
        //convert/luck/credit
        $.post(
            'url' + 'convert/luck/credit',
            {
                token: token
            },
            function (data) {
                var data = $.parseJSON(data);
                console.log("jiangpin：" + JSON.stringify(data));
                lottery.datanum = data.data.convert.id;
                // console.log(lottery.datanum)


            });


    },
    isHasElement: function (arr, value) {  //查找数组中的索引
        var str = arr.toString();
        var index = str.indexOf(value);
        if (index >= 0) {
            //存在返回索引
            var reg1 = new RegExp("((^|,)" + value + "(,|$))", "gi");
            return str.replace(reg1, "$2@$3").replace(/[^,@]/g, "").indexOf("@");
        } else {
            return -1;//不存在此项
        }
    }

};

function roll() {
    lottery.times += 1;
    lottery.roll();
    if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
        lottery.callback(lottery.index)
        clearTimeout(lottery.timer);
        lottery.prize = -1;
        lottery.times = 0;
        click = false;
    } else {
        if (lottery.times < lottery.cycle) {
            lottery.speed -= 10;
        } else if (lottery.times == lottery.cycle) {
            //中奖位置  哈哈终于找到了
            console.log(lottery.datanum)
            var nnnn = lottery.isHasElement(lottery.goodsArry, lottery.datanum)
            console.log(nnnn)
            var index = nnnn //Math.random()*(lottery.count)|0;

            lottery.prize = index;
        } else {
            if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                lottery.speed += 110;
            } else {
                lottery.speed += 20;
            }
        }
        if (lottery.speed < 40) {
            lottery.speed = 40;
        }
        ;
        console.log(lottery.times + '^^^^^^' + lottery.speed + '^^^^^^^' + lottery.prize);
        lottery.timer = setTimeout(roll, lottery.speed);
    }
    return false;
}

var click = false;

function chouj() {



    // alert("ajp")
    lottery.init('box_list');
    $("#drawBtn").click(function () {

        console.log(lottery.mount)
        if (lottery.mount < 300) {

            toNative(lottery.mount)

        } else {


            // alert("ajp")
            if (click) {
                return false;
            } else {

                lottery.getData();
                getCunut()
                lottery.speed = 20;
                lottery.prize = -1;
                roll();
                click = true;
                return false;
            }
        }
    });


};


//跳转原生的方法
function toNative(num) {
    //判断手机
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = /android/.test(ua);
    var isiOS = /iphone|ipad|ipod/.test(ua);
    if (isiOS) {
        //iOS链接方法
        function setupWebViewJavascriptBridge(callback) {
            if (window.WebViewJavascriptBridge) {
                return callback(WebViewJavascriptBridge);
            }
            if (window.WVJBCallbacks) {
                return window.WVJBCallbacks.push(callback);
            }
            window.WVJBCallbacks = [callback];
            var WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function () {
                document.documentElement.removeChild(WVJBIframe)
            }, 0)
        }

        //iOS桥的链接
        setupWebViewJavascriptBridge(function (bridge) {
            var uniqueId = 1

            function log(message, data) {
                var log = document.getElementById('one')
            }

            //html5创建方法，iOS进行调用
            bridge.registerHandler('htmlGoodsIdHandler', function (data, responseCallback) {
                var responseData = {'Javascript Says': '回调成功!'}
                responseCallback(responseData)
            })
            //iOS创建方法，html5进行调用

            bridge.callHandler('iOSShowModouRecharge', {userCredit: num}, function (response) {
            })

            console.log(num + "fdojkspo")

        })
    }
    if (isAndroid) {
        //安卓链接方法


        //html传给native、


        //call native method
        window.WebViewJavascriptBridge.callHandler(
            'submitFromWeb'
            , {'code': "1003", 'userCredit': num}
            , function (responseData) {
            }
        );

        console.log(num + "androil")

        function connectWebViewJavascriptBridge(callback) {
            if (window.WebViewJavascriptBridge) {
                callback(WebViewJavascriptBridge)
            } else {
                document.addEventListener(
                    'WebViewJavascriptBridgeReady'
                    , function () {
                        callback(WebViewJavascriptBridge)
                    },
                    false
                );
            }
        }

        connectWebViewJavascriptBridge(function (bridge) {
            //html接收值
            bridge.init(function (message, responseCallback) {
                console.log('JS got a message', message);
                var data = {
                    'Javascript Responds': '测试中文!'
                };
                console.log('JS responding with', data);
                responseCallback(data);
            });
            //
            bridge.registerHandler("functionInJs", function (data, responseCallback) {
                var responseData = "html回调成功";
                responseCallback(responseData);
            });
        })
    }
}
