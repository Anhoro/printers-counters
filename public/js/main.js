"use strict";

const connectionBtn = document.getElementsByClassName('connection__btn')[0];
const containerDisconnected = document.getElementsByClassName('connection__container')[0];
const containerConnected = document.getElementsByClassName('connection__container')[1];
const connectionMeta = document.getElementsByClassName('connection__meta')[0];
const connectionMetaDB = connectionMeta.getElementsByClassName('connection__database')[0];
const connectionMetaTime = connectionMeta.getElementsByClassName('connection__session-time')[0];
const connectionForm = document.getElementsByClassName('form__credentials')[0];
const btnSubmit = document.getElementsByClassName('btn__credentials')[0];//
const btnReturn = document.getElementsByClassName('btn__return')[0];
const requestLoading = document.getElementsByClassName('request__loading')[0];
const requestMessage = document.getElementsByClassName('request__message')[0];

/* url of a web server of the back-end; i.e. http://192.168.1.100:3000 */
const BASE_URL = 'http://localhost:3000';

let isConnected = false;
let ifFetching = false;

connectionBtn.addEventListener('click', onDisconnectOrOpenForm);
btnSubmit.addEventListener('click', onFormSubmit);
btnReturn.addEventListener('click', onCloseForm);

getConnectionInfo();

/* show/hide Connection Button */
function toggleConnectionBtnView() {
    if (isConnected) {
        containerConnected.classList.remove('hidden');
        containerDisconnected.classList.add('hidden');
        connectionMeta.classList.remove('hidden');
    } else {
        containerConnected.classList.add('hidden');
        containerDisconnected.classList.remove('hidden');
        connectionMeta.classList.add('hidden');
    }
}

/* show/hide Form */
function toggleFromView(isFormVisible) {
    if (isFormVisible) {
        connectionForm.classList.remove('hidden');
        connectionBtn.classList.add('hidden');
        connectionMeta.classList.add('hidden');
    } else {
        connectionForm.classList.add('hidden');
        connectionBtn.classList.remove('hidden');
        // if (isConnected) {
        //     connectionMeta.classList.remove('hidden');
        // }
        requestMessage.classList.add('hidden');
    }
}

/* fetch data about connection to the DB, and add visual representation of a response */
async function getConnectionInfo() {
    const url = BASE_URL + '/connection';
    ifFetching = true;
    requestLoading.classList.remove('hidden');

    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    res = await res.json();
    /*.then((res) => {
            return res.json().value;
        });*/

    ifFetching = false;
    requestLoading.classList.add('hidden');

    if (res.database === '') {
        isConnected = false;
    } else {
        isConnected = true;
        connectionMetaDB.innerHTML = res.database;
        connectionMetaTime.innerHTML = calcSessionTime(new Date(res.sessionStart));
    }

    toggleConnectionBtnView();
}

/* input: Date from a DB. output: total session time in format like 7d 2h 23m */
function calcSessionTime(date1) {
    let sessionTime = '';
    const date2 = Date.now();
    let difference = Math.abs(date2 - date1);
    console.log(difference);
    let sub;
    let tmp;

    for (let i = 0; i < 3; i++) {
        switch (i) {
            case 0: {
                sub = 1000*60*60*24;
                tmp = Math.floor(difference / (sub));
                sessionTime += tmp + 'd ';
                difference -= tmp * sub;
                break;
            }
            case 1: {
                sub = 1000*60*60;
                tmp = Math.floor(difference / (sub));
                sessionTime += tmp + 'h ';
                difference -= tmp  * sub;
                break;
            }
            case 2: {
                sub = 1000*60;
                tmp = Math.floor(difference / (sub));
                sessionTime += tmp + 'm';
                difference -= tmp  * sub;
                break;
            }
        }
    }

    return sessionTime;
}

/* method for future refactoring of a calcSessionTime method */
// function calcTimeUnit() {
//
// }

/* when a button with class 'btn__return' is clicked */
function onCloseForm(e) {
    toggleFromView(false);
    toggleConnectionBtnView();
}

/* if disconnected - shows connection form, else - send a disconnection request to the DB */
async function onDisconnectOrOpenForm(e) {
    if (!isConnected) {
        toggleFromView(true);
    } else {
        const reqBody = {
            'db-url': '',
            'db-title': '',
            'user-login': '',
            'user-password': '',
            sessionStart: ''
        };

        const url = BASE_URL + '/connection';

        const requestMessageText = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        });

        isConnected = false;
        toggleConnectionBtnView();
    }
}

/* send DB credentials to the DB in order to connect to it */
async function onFormSubmit(e) {
    ifFetching = true;
    btnSubmit.disabled = true;
    btnReturn.disabled = true;
    btnSubmit.blur();
    requestLoading.classList.remove('hidden');
    let requestMessageClass = 'request__message';
    e.preventDefault();

    const reqBody = {
        ...Object.fromEntries(new FormData(e.target.form)),
        sessionStart: (new Date()).toJSON()
    };

    const requestMessageText = await fetch(e.target.form.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    }).then((res) => {
        return res.json();
    }).then((res) => {
        if (res.code === 'SUCCESS') {
            isConnected = true;
            requestMessageClass += '_success';
            connectionMetaDB.innerHTML = reqBody['db-title'];
            connectionMetaTime.innerHTML = calcSessionTime(Date.now());
            return res.message;
        } else {
            throw Error('Error. ' + res.message);
        }            
    }).catch((err) => {
        isConnected = false;
        requestMessageClass += '_error';
        return err.message;
    });
    
    ifFetching = false;
    btnSubmit.disabled = false;
    btnReturn.disabled = false;
    requestLoading.classList.add('hidden');
    requestMessage.classList.remove('hidden');
    requestMessage.innerHTML = requestMessageText;
    requestMessage.classList.remove('request__message_success');
    requestMessage.classList.remove('request__message_error');
    requestMessage.classList.add(requestMessageClass);
}
