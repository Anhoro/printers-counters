const expect = require('chai').expect;
/*const sinon = require('sinon'); //tmp */

const helper = require('../helper');

const mockKeywordsStr = 'la;be;me';
const mockKeywordsArr = ['la', 'be', 'me'];
const mockString = `<lala>lorem lolo loripsum lorem ipsum lorem mpsum lorem
    lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
    Total pages: lorem ipsum lorem >19001<ipsum lorem ipsumlorem ldslo lol
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
    lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsum`;

describe('helper.js', function() {
    /*before(function() {
        config.db.database = "test-printers-counters";
    });*/

    describe('getKeywordsArrFromString', function() {
        it('should convert a mock keywords string into an arr', async function() {
            let err = false;
            const convertedArr = helper.getKeywordsArrFromString(mockKeywordsStr);
            
            for(let i = 0; i < convertedArr.length; i++) {
                if (convertedArr[i] !== mockKeywordsArr[i]) {
                    err = true;
                    break;
                }
            }

            expect(err).to.be.false;
        });

        it('should fail to convert a mock keywords string into an arr', async function() {
            let err = false;
            const mockFailedArr = ['la', 'li'];
            const convertedArr = helper.getKeywordsArrFromString(mockKeywordsStr);
            
            for(let i = 0; i < convertedArr.length; i++) {
                if (convertedArr[i] !== mockFailedArr[i]) {
                    err = true;
                    break;
                }
            }

            expect(err).to.be.true;
        });
    });

    describe('updateKeywordsString', function() {
        it('should convert a mock keywords arr into a string', async function() {
            let err = false;
            const convertedStr = helper.updateKeywordsString(mockKeywordsArr);
            
            if (convertedStr !== mockKeywordsStr)
                err = true;

            expect(err).to.be.false;
        });

        it('should fail to convert a mock keywords arr into a string', async function() {
            let err = false;
            const convertedStr = helper.updateKeywordsString(mockKeywordsArr) + 'text';
            
            if (convertedStr !== mockKeywordsStr)
                err = true;

            expect(err).to.be.true;
        });
    });

    describe('locateCounter', function() {
        it('should locate string with length of 128 symbols near counter keyword', async function() {
            const countersKeywords = 'Total pages';
            
            const locatedCounter = helper.locateCounter(mockString, countersKeywords);

            expect(locatedCounter.length).to.be.equal(128);
        });

        it('should locate string with length of 128 symbols near counters keywords', async function() {
            const countersKeywords = 'Ea ea;Total o pages;Lala;Total pages;ni';
            
            const locatedCounter = helper.locateCounter(mockString, countersKeywords);

            expect(locatedCounter.length).to.be.equal(128);
        });

        it('should not locate string near counters keywords and return undefined', async function() {
            const countersKeywords = 'Ea ea;Total o pages;Lala';

            const locatedCounter = helper.locateCounter(mockString, countersKeywords);

            expect(locatedCounter).to.be.null;
        });
    });

    describe('getCounterFromString', function() {
        it('should get counter from a mockLocatedStr and be equal to 10200', async function() {
            const locatedStr = '>10200<';

            const counter = helper.getCounterFromString(locatedStr);

            expect(counter).to.be.equal(10200);
        });
    });


    /*after(function() {
        config.db.database = "printers-counters";
    });*/
});
