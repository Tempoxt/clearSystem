import ZK from './baseISSObject'
import $ from 'jquery'
var issOnlineUrl = "http://localhost:24010/ZKIDROnline";
var browserFlag = getBrowserType();
//消息控件的使用类型的类
var msgType = 
{
	info : "info",
	success : "success",
	warning : "warning",
	error : "error",
	loading : "loading"
};

var Device = function()
{
	message : ""
};
function createISSonlineDevice(setting)
{ 
	var ISSOnline = "ZKIDROnline";
	var browserFlag = getBrowserType() || "";
	//刷卡信息返回默认方法
	if(typeof setting.Methods == "object")
	{
		if(typeof setting.Methods.showMessage != "function")
		{
			setting.Methods.showMessage = function(type,message)
			{
				$("#cert_message").text(message);
				$("#cert_message_type").text(msgType[type]);
			}
		}
		//检查驱动安装默认方法
		if(typeof setting.Methods.checkWebServer != "function")
		{ 
			setting.Methods.checkWebServer = function(myDevice)
			{ 
				var ISSVersion = function(){};
				ZK.extend(ISSVersion, Device, {
					message : "",
					url : "/info",
					interfaceResult : 
					{
						0:{mean:"成功",message:"二代身份证读取成功！",type:"success",notShow:true}
					},
					dealDeviceData:function(result){
						var existVersion = result.data.server_version;//2.7.1
						var curVersion = "${application['fpDriver.version']}";//3.5.2
						var existVersionArr = existVersion.split(".");
						var curVersionArr = curVersion.split(".");
						var isLast = true;
						var len = existVersionArr.length;
						for(var i=len;i>0;i--)
						{
							var existVersionTemp = parseInt(existVersionArr[i-1]);
							var curVersionTemp = parseInt(curVersionArr[i-1]);
							if(existVersionTemp<curVersionTemp)
							{
								isLast = false;
							}
							else if(existVersionTemp>curVersionTemp)
							{
								isLast = true;
							}
							else
							{
								//等于 忽略
							}
						}
						 
						//if(result.data.server_version >= "${application['fpDriver.version']}")
						if(isLast)
						{
							if(typeof setting.Methods.detectSuccess == "function")
							{
								setting.Methods.detectSuccess();
							}
							if(typeof myDevice == "object")
							{
								//连接设备，处理返回信息
								setTimeout(function(){
									myDevice.accessDevice();
								},100);
							}
						}
						else
						{
							if(typeof setting.Methods.detectWarning == "function")
							{
								setting.Methods.detectWarning();
							}
							if(typeof myDevice == "object")
							{
								//连接设备，处理返回信息
								setTimeout(function(){
									myDevice.accessDevice();
								},100);
							}
							else
							{
								if(typeof setting.Methods.notInstall == "function")
								{
									setting.Methods.notInstall();
								}
							}
						}
					},
					installDrive:function(){
						if(typeof setting.Methods.detectError == "function")
						{
							setting.Methods.detectError();
						}
						if(typeof myDevice == "object")
						{
							closeMessage();
							//驱动未安装
							setting.Methods.downloadDrive();
						}
						else
						{
							if(typeof setting.Methods.notInstall == "function")
							{
								setting.Methods.notInstall();
							}
						}
						
						return false;
					}
				});
				 
				var version = new ISSVersion();
				version.accessDevice();
			}
		}
		//下载驱动默认方法
		if(typeof setting.Methods.downloadDrive != "function")
		{
			setting.Methods.downloadDrive = function()
			{
				messageBox({messageType: "confirm", text: "请安装相关硬件驱动！点击确定下载驱动。",
				callback: function(result){ 
						if(result)
						{
							window.location.href = "middleware/ZKIDROnline.exe";
						}
						closeMessage();
				}});
			}
		}
	}
	/**
	 * 设备
	 */
	
	var buttonNames = {"Cert":"","Scanner":"","Barcode":""};
	if(typeof setting.Cert == "object")
	{
		buttonNames.Cert = setting.Cert.select;
		//身份证阅读器
		var Cert = function(){};
		ZK.extend(Cert, Device, {
			//提示信息
			message : "请将二代身份证放到读卡区域...",
			//服务url
			url : "/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1&common=1" + "&random=" + getRandomNum(),
			//接口返回值
			interfaceResult : 
			{
				0:{mean:"成功",message:"二代身份证读取成功！",type:"success"},
				1:{mean:"端口打开失败",message:"未检测到二代身份证阅读器！",type:"warning"},
				2:{mean:"数据传输超时",message:"未检测到二代身份证阅读器！",type:"error"},
				10:{mean:"没有找到卡",message:"未读取到身份证，请重新刷卡！",type:"warning"},
				11:{mean:"读卡操作失败",message:"未检测到二代身份证阅读器！",type:"error"},
				20:{mean:"自检失败",message:"二代身份证读取失败！",type:"error"},
				30:{mean:"其他错误",message:"二代身份证读取失败！",type:"error"},
				40:{mean:"相片解码失败",message:"二代身份证读取失败！",type:"error"},
				100:{mean:"超时",message:"未读取到身份证，请重新刷卡！",type:"warning"},
				200:{mean:"GetBase64PhotoData",message:"二代身份证读取失败！",type:"error"}
			},
			dealDeviceData:setting.Cert.callBack
		});
	}
	
	//工厂
	var DeviceFactory = 
	{
		createDevice : function(button){
			var device;
			switch(button){
				case "Cert":
					device = new Cert();
					break;
				case "Scanner":
					device = new Scanner();
					break;
				case "Barcode":
				default:
					device = new BarcodeScanner();
					break;
			}
			return device;
		}
	}
	//设备工厂
	Device.prototype.createDevice = function(button)
	{
		return DeviceFactory.createDevice(button);
	};
	//信息显示
	Device.prototype.setMessage = function()
	{ 
		setting.Methods.showMessage(msgType.loading,this.message);
	};
	
	//处理硬件返回值
	Device.prototype.dealDeviceInfo = function(result)
	{
		if(result === null||result.ret===null)
		{
			setting.Methods.showMessage("error","设备连接异常");
			return;
		}
		//信息提示
		var info = this.interfaceResult[result.ret];
		if(info == undefined)
		{
			setting.Methods.showMessage("error","设备连接异常");
			return;
		}
		if(info.notShow == undefined)
		{
			setting.Methods.showMessage(info.type,info.message);
		}
		//处理数据
		if("success" === info.type)
		{
			this.dealDeviceData(result);
		}
	};
	
	//html5使用ajax方式访问服务
	Device.prototype.ajaxAccess = function(url)
	{ 
		var result = null;
		var parent = this;
		$.ajax({
			type : "GET",
			url : issOnlineUrl + url,
			dataType : "text",
			async:true,
			timeout:10000,
			success : function(data)
			{ 
				data = data.replace(/\\/g,"/");
				try{
					result = JSON.parse(data);
				}catch(e){
					result = eval("("+data+")");
				}
				parent.dealDeviceInfo(result);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) 
			{
				 
				console.info(errorThrown+"url:"+url);
				if(textStatus == "timeout" && url != "/info")
				{
					setting.Methods.showMessage("warning","未读取到身份证，请重新刷卡！");
				}
				else if(typeof parent.installDrive == "function")
				{
					if(parent.installDrive())
					{
						setting.Methods.showMessage("error","设备连接异常");
					}
				}
				else
				{
					setting.Methods.showMessage("error","设备连接异常");
				}
			}			
		});
	};
	
	//IE8、IE9访问服务
	Device.prototype.xDomainAccess = function(url)
	{
		var parent = this;
		var xDomainRequest = new XDomainRequest();
		if (xDomainRequest) 
		{ 
			xDomainRequest.timeout=10000;
			xDomainRequest.open('GET', issOnlineUrl + url);
			xDomainRequest.onload = function()
			{
				var resultData = xDomainRequest.responseText;
				resultData = resultData.replace(/\\/g,"/");
				var obj = JSON.parse(resultData);
				parent.dealDeviceInfo(obj);
			};
			xDomainRequest.onerror = function()
			{
				//用完后，将对象置为空
				xDomainRequest = null;
				setting.Methods.showMessage("error","设备连接异常");
			};
			xDomainRequest.ontimeout = function()
			{
				//用完后，将对象置为空
				xDomainRequest = null;
				setting.Methods.showMessage("error","设备连接异常");
			};
			xDomainRequest.send();
		}
	};
	
	//驱动检测
	Device.prototype.installDrive = function()
	{
		return true;
	};
	//设备通信,得到硬件返回的数据
	Device.prototype.accessDevice = function()
	{
		$("#iss").css("width","25%");
		if(browserFlag == "html5"||browserFlag == "simple")
		{
			this.ajaxAccess(this.url);
		}
		else if(browserFlag == "simple")
		{
			this.xDomainAccess(this.url);
		}
		else
		{
			if(window.console)
			{
				console.error("browserFlag is missing");
			}
		}
	};
	
	Device.prototype.startFun = function()
	{
		//创建设备
		var device = new Device();
		var myDevice = device.createDevice("Cert");
		//显示提示信息
		// myDevice.setMessage();
		setting.Methods.checkWebServer(myDevice);
	};
	/*
	$.each(buttonNames, function(key, value){
		if(value)
		{
			$(document).off("click",value);
			$(document).on("click",value,function(e){ 
				$(value).blur();
				//创建设备
				var device = new Device();
				var myDevice = device.createDevice(key);
				//显示提示信息
				myDevice.setMessage();
				setting.Methods.checkWebServer(myDevice);
			});
		}
		
	}); 
*/
	setting.Methods.checkWebServer();
}


function DoGetSNR()
{
	$.ajax( {
		type : "GET",
		url : "http://localhost:24010/ZKIDROnline/MFCard?OP-DEV=1&CMD-URL=1&iPort=3",
		dataType : "json",
		async: true,
		success : function(data) 
		{
			//返回码
			var ret = null;
 			ret = data.ret;
 			//接口调用成功返回时
 			if(ret == 0)
			{
				alert("ICSnr:" + data.data.ICSnr);
			}
			else
			{
				alert("ret:" + data.ret);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) 
		{
			alert("请安装IDROnline SDK!");
	    }
	});
}


// common


function getRandomNum() 
{
    var random = parseInt(Math.random() * 10000);
    return random;
}

//消息控件的使用类型的类
var msgType = 
{
	info : "info",
	success : "success",
	warning : "warning",
	error : "error",
	loading : "loading"
};

function getBrowserType()
{
	var browserFlag = "";
	 //是否支持html5的cors跨域
    if (typeof(Worker) !== "undefined")
    {
        browserFlag = "html5";
    }
    //此处判断ie8、ie9
    else if(navigator.userAgent.indexOf("MSIE 7.0")>0||navigator.userAgent.indexOf("MSIE 8.0")>0 || navigator.userAgent.indexOf("MSIE 9.0")>0)
    {
        browserFlag = "simple";
    }
    else
	{
		browserFlag = "upgradeBrowser";//当前浏览器不支持该功能,请升级浏览器
	}
    return browserFlag;
}


function openMessage(type, text, ptimeout)
{ 
	text = (text == "" ? null : text);
	var timeout = 1000;
	if(type == msgType.warning || type == msgType.info)//警告
	{
		timeout = 3000;
	}
	else if(type == msgType.success)//成功 
	{
		
		text = (text && text != null ? text : "操作成功");//${common_op_succeed}:操作成功
		var num = strlen(text)/30;
		num = num > 8 ? 8 : num;
		timeout = Math.ceil(num) * timeout;//动态判断显示字符数的长度来延长显示时间
	}
	else if(type == msgType.error)//失败
	{
		text = (text && text != null) ? text : "操作失败";//${common_op_failed}:操作失败，程序出现异常
		timeout = 3000;
	}
	else if(type == msgType.loading)//处理中
	{
		timeout = 0;//当为'loading'时，timeout值会被设置为0，表示不会自动关闭。
		text = text && text != null ? text : "处理中";//${common_op_processing}:处理中
	}
	var width = strlen(text) * 6.1 + 45;//按字符计算宽度
	timeout = ptimeout ? ptimeout : timeout;
	$.jBox.tip(text, type,{timeout: timeout, width: (width > 400 ? 400 : "auto")});//设定最大宽度为400
}


function closeMessage(timeout)
{
	timeout = timeout ? timeout : 1000;
	window.setTimeout("$.jBox.closeTip();", timeout);//设定最小等待时间
}

function strlen(str)
{  
    var len = 0;  
    if(str != null)
    {
   		for (var i=0; i<str.length; i++)
    	{   
			var c = str.charCodeAt(i);
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) 
			{
				len++;   
			}	
			else 
			{
				len+=2;   
			}
    	}
    }
    return len;
}  

function messageBox(paramsJson)
{ 

	this.messageType = paramsJson.messageType ? $.trim(paramsJson.messageType) : "confirm";
	this.types = "";
  	if(paramsJson.type)
  	{
  		this.typeArray = paramsJson.type.split(" ");
	  	for(var i=0; i<this.typeArray.length; i++)
	  	{
  			this.types += this.typeArray[i]+" ";
	  	}
  	}
  	switch(this.messageType)
	{
		case "confirm":
		  	$.jBox.confirm(paramsJson.text, "提示", function(v, h, f) {
	     		if (v == "ok") 
	     		{ 
	     	 		paramsJson.callback(true);
	     		}
			});
			break;
	}
}
Device.createISSonlineDevice = createISSonlineDevice
export default Device
