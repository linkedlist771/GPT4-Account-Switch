// ==UserScript==
// @name         🚀🚀GPT4直连账号切换🚀🚀
// @namespace    gpt4-account-switch
// @version      0.0.1
// @description  为GPT4直连账号切换提供便利
// @author       LLinkedList771
// @run-at       document-start

// @match        https://gpt4.xn--fiqq6k90ovivepbxtg0bz10m.xyz/*
// @homepageURL  https://github.com/linkedlist771/GPT4-Account-Switch
// @supportURL   https://github.com/linkedlist771/GPT4-Account-Switch/issues


// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    let accountData = null;

    function setAccountData(data) {
        accountData = data;
    }

    // ----------------- Styles -----------------
    function addStyles() {
        const styles = `
            .tools-logger-panel {
                position: fixed;
                top: 10%;
                right: 2%;
                background-color: white;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                width: 250px;
            }
            .head {
                font-weight: bold;
                margin-bottom: 10px;
            }
            .switch
                display: inline-block;
                vertical-align: middle;
            }
            .close {
                cursor: pointer;
            }
            .loadAccountJsonBtn {
                border: 1px solid #ccc;
                border-radius: 5px;
                text-decoration: underline;

            }
            .account-btn {
                padding: 5px 10px;
                margin: 5px 0;
                background-color: #f0f0f0;  
                font-weight: bold; 
                font-color: red;
            }

        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // ----------------- UI Creation -----------------
    function createUI() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'tools-logger-panel';
    
        controlDiv.innerHTML = `
            <div class="head">
                <span>GPT4账号切换助手</span>
                <span class="close" style="float:right; cursor:pointer; margin-right:5px;">x</span>
            </div>
            <div class="main">
                <button id="loadAccountJsonBtn">导入账号信息</button>
            </div>
            <div class="switch">

            </div>
        `;
    
        document.body.appendChild(controlDiv);
    
        controlDiv.querySelector(".close").onclick = function() {
            controlDiv.remove();
        };
    
        // 添加文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        controlDiv.appendChild(fileInput);
    
        // 为导入账号信息按钮添加点击事件监听器
        document.getElementById("loadAccountJsonBtn").addEventListener("click", function() {
            fileInput.click();
        });
    
        // 监听文件选择事件
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
    
            // 创建FileReader对象
            const reader = new FileReader();
    
            // 监听文件读取完成事件
            reader.onload = function(event) {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    // 在这里处理获取到的JSON数据
                    console.log(jsonData);
                    processAccountJsonData(jsonData);
                    // 可以在这里执行其他操作,如在页面上显示数据等
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            // 读取文件内容为文本
            reader.readAsText(file);
        });
    }
   
    // 获取当前的url的(去掉路由) 
    function getCurrentUrl() {
        const targetURLBase = window.location.protocol + '//' + window.location.host;
        return targetURLBase;
    }
    
    function redirectToBaseUrl(){
        // https://gpt4.xn--fiqq6k90ovivepbxtg0bz10m.xyz/auth/login
        console.log('Log in');
        const targetURLBase = getCurrentUrl();
        window.location.href = targetURLBase;
    }

    function logOutCurrentAccount(accessToken) {
        const targetURLBase = getCurrentUrl();
        const logoutURL = targetURLBase + '/auth/logout';

        window.location.href = logoutURL;
    }

    function logInNewAccount(accessToken) {
        var loginBtn = document.querySelector('#submit-token');
        if(loginBtn) {
            loginBtn.click();
        }
        // 找到textarea的第一个textarea 填入accessToken
        var textArea = document.querySelector('textarea');
        if(textArea) {
            textArea.value = accessToken;
        }
        // 找到button里面的值（innerHtml)为OK的按钮
        var okBtn = Array.from(document.querySelectorAll('button')).find(function(btn) {
            return btn.innerText.trim() === 'OK';
        });
    
        if(okBtn) {
            okBtn.click();
        }

    }





    // 这里我想获取当前点击的button的索引可以吗？ 然后
    function switchAccount(accessToken)
    {
        // 首先登出当前账号
        logOutCurrentAccount(accessToken);
        // 然后登录新的账号
        // 等三秒钟
        console.log('Log out');

    }

    function processAccountJsonData(jsonData) {
        // 首先存到localStorage
        localStorage.setItem('gpt4_account_json', JSON.stringify(jsonData));
        setAccountData(jsonData);
        // 创建切换账号按钮
        creatSwitchBtnUI(); // 确保此时已经有有效的accountData来创建按钮
    }
    function alertLoadAccountData() {
        alert('请先导入账号信息');
    }

    function retriveAccountData() {
        // 1.首先判断当前的accountData是否为空
        if(accountData !== null) {
            return true;
        }
        // 2.从localStorage中读取数据
        const jsonData = localStorage.getItem('gpt4_account_json');
        if(jsonData !== null) {
            accountData = JSON.parse(jsonData);
            return true;
        }
        
        // 如果当前的accountData为空, 但是localStoraage也为空, 则提示当前需要加载账号信息
        alertLoadAccountData();
        return false;
    }

    function creatSwitchBtnUI() {
        const controlDiv = document.querySelector('.tools-logger-panel .switch');
        if (!controlDiv) return;
        let button = document.createElement('button');
        button.className = 'account-btn';
    
        button.textContent = `登出账号`;
        button.onclick = () => {
            // Logic to switch accounts
            // setAccountData(accountData[key]);
            logOutCurrentAccount();
            console.log('Switched to account:', accountData[key]);
            
        };
        controlDiv.appendChild(button);
        //                 redirectToBaseUrl();

        button = document.createElement('button');
        button.className = 'account-btn';

        button.textContent = `登录账号`;
        button.onclick = () => {
            // Logic to switch accounts
            // setAccountData(accountData[key]);
            redirectToBaseUrl();
            console.log('Switched to account:', accountData[key]);
            
        };
        controlDiv.appendChild(button);


        Object.keys(accountData).forEach((key, index) => {
            const button = document.createElement('button');
            button.className = 'account-btn';
    
            button.textContent = `登录账号${index + 1}`;
            button.onclick = () => {
                // Logic to switch accounts
                // setAccountData(accountData[key]);
                logInNewAccount(accountData[key]);
                console.log('Switched to account:', accountData[key]);
                
            };
            controlDiv.appendChild(button);

        

            
        });
    }

    function loadAndCreateAccountSwitchBtnUI(){
        // 首先判断localStorage中是否有数据
        if(!retriveAccountData())
        {
            return;
        }
        creatSwitchBtnUI(); // Create switch buttons based on account data

        // 现在开始加载UI

    }
    

   // ----------------- Initialization -----------------
   addStyles();

   // 确保在DOM完全加载后再创建UI
   document.addEventListener('DOMContentLoaded', function() {
       createUI();
       loadAndCreateAccountSwitchBtnUI(); // Ensure the switch buttons are created after UI is loaded and data is retrieved

   });


})();