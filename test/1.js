const expect = require('chai').expect;
const sinon = require('sinon');

const usersService = require('../services/users');
const helper = require('../helper');
const countersServce = require('../services/counters');

/*const str = `
    laldfssf sdf sdfsife jojef jfa lala al alalala lala a la la 
    lala lorergm ipsum la lala lala al aleedalala lala a la la 
    lala lorem ipsum la ladala lala al alalala lala a la la 
    lala lorem ipsum lrewrwera lala lala al alalala lala a la la 
    lala lorem ipsumwwe la lala lala al alalala lala a la la
    lala lorem ipsum laadsf lala lala al alalala lala a la la 
    lala lorem ipsum la lala laadsfla al alalala lala a la la 
    lala lorem ipsum lasadf lala lala alr alalala lala a la la 
    lala lrtorem ipsugtm la lala laasdla al alalala lala a la la 
    lala lorem ipsum la lala ladsfala al alalagla lala a la la 
    lalaTotal pages: lorem ipssadwdum<span>51007</span> la 
    laldfssf sdf sdfsife jojef jfa lala al alalala lala a la la 
    lala lorergm ipsum la lala lala al aleedalala lala a la la 
    lala lorem ipsum la ladala lala al alalala lala a la la 
    lala lorem ipsum lrewrwera lala lala al alalala lala a la la 
    lala lorem ipsumwwe la lala lala al alalala lala a la la
    laldfssf sdf sdfsife jojef jfa lala al alalala lala a la la 
    lala lorergm ipsum la lala lala al aleedalala lala a la la 
    lala lorem ipsum la ladala lala al alalala lala a la la 
    lala lorem ipsum lrewrwera lala lala al alalala lala a la la 
    lala lorem ipsumwwe la lala lala al alalala lala a la la
    laldfssf sdf sdfsife jojef jfa lala al alalala lala a la la 
    lala lorergm ipsum la lala lala al aleedalala lala a la la 
    lala lorem ipsum la ladala lala al alalala lala a la la 
    lala lorem ipsum lrewrwera lala lala al alalala lala a la la 
    lala lorem ipsumwwe la lala lala al alalala lala a la la `;*/

describe('services/counters.js', function() {
    describe('getCounterFromWebsite', function() {
        it('should fetch mock website data, locate a counter keyword and return a counter value 19001', async function() {
            sinon.stub(helper, 'fetchWebsite');
            helper.fetchWebsite.returns(new Promise (function(resolve, reject) {
                resolve(`
                <lala>lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                Total pagesss: lorem ipsum lorem >19001<ipsum lorem ipsumlorem
                welmelfjer jferjfe orf ejfefoj eiefiorfij ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum`);
            }));

            const res = await countersServce.getCounterFromWebsite('', 'Total pagesss');
            expect(res).to.be.equal(19001);

            helper.fetchWebsite.restore();
        });
    })
});



//it('should return user data', function() {
    //console.log(usersService.getMultipleUsers());
    //expect([1,2,3,4,5]).to.have.lengthOf(5);
    //expect(usersService.getMultipleUsers.bind(this)).to.have.lengthOf(5);
    //expect(usersService.getMultipleUsers.bind(this).data).to.have.lengthOf(5); //above not recommended...
//})


/*
function locateCounter(str, counterKeyword) {
function getCounterFromString(str) {

getMultipleUsers
createUser
authenticateUser(user)
checkLogin(userLogin)
*/

//tmp
/*
app.use(async (req, res, next) => {
    const tmpStr1 = `
    h1 lal
    alalsaldlasdlaldalalla la lal aal a
    lala lal alal laa lalal al
    asdalsjdja adjf ernfernf ujpowi joedfwje fnern e ef 
    asjdasjdjajajajdfer foj je ojfj j eoejeoer u eruo eu 
    ads ldowek eijwejf ijdj sjfd kfnkrgt f ajw f  e fweoifjwf
    asdalsjdja adjf ernfernf ujpowi joedfwje fnern e ef 
    asjdasjdjajajajdfer foj je ojfj j eoejeoer u eruo eu 
    ads ldowek eijwejf ijdj sjfd kfnkrgt f ajw f  e fweoifjwf
    lal a
    lal aa
    alala a lalal aTotal pages: <p>12</p>another asdi akdskajasdn
    asdalsjdja adjf ernfernf ujpowi joedfwje fnern e ef 
    asjdasjdjajajajdfer foj je ojfj j eoejeoer u eruo eu 
    ads ldowek eijwejf ijdj sjfd kfnkrgt f ajw f  e fweoifjwf
    asdalsjdja adjf ernfernf ujpowi joedfwje fnern e ef 
    asjdasjdjajajajdfer foj je ojfj j eoejeoer u eruo eu 
    ads ldowek eijwejf ijdj sjfd kfnkrgt f ajw f  e fweoifjwf
    asdalsjdja adjf ernfernf ujpowi joedfwje fnern e ef 
    asjdasjdjajajajdfer foj je ojfj j eoejeoer u eruo eu 
    ads ldowek eijwejf ijdj sjfd kfnkrgt f ajw f  e fweoifjwf
    asdalsjdja adjf ernfernf ujpowi joedfwje fnern e ef 
    asjdasjdjajajajdfer foj je ojfj j eoejeoer u eruo eu 
    ads ldowek eijwejf ijdj sjfd kfnkrgt f ajw f  e fweoifjwf`;

    //const BASE_URL = 'http://localhost:8080/HP%20LaserJet%20MFP%20M426dw%C2%A0%C2%A0%C2%A010.11.9.171.html';
    //const tmpStr = await tmpHelper.fetchWebsite(BASE_URL);
    const tmpKeyword = 'Всего оттисков';
    const locatedStr = tmpHelper.locateCounter(tmpStr1, tmpKeyword);
    //const counter = tmpHelper.getCounterFromString(locatedStr);
    console.log('locatedStr');
    console.log(locatedStr);
    //console.log('counter');
    //console.log(counter);

    next();
});*/