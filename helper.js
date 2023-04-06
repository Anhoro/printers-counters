const path = require('path');
const http = require('http');
const iconv = require('iconv-lite');

/* calculate offset that used in MySQL LIMIT operator; used for paginating result */
function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

/* always return an array*/
function emptyArrOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

/* could be renamed to locateKeywordInStr (used both for counters and consumables) */
/* find and return located string `...${counters | consumable Keywords}...>999<...` from a full .html webpage */
function locateCounter(str, countersKeywords, locatedStrLength) {
  /* length of a located string (without ${countersKeywords}) */
  const LOCATED_LENGTH = locatedStrLength || 128;
  console.log('LOCATED_LENGTH');
  console.log(LOCATED_LENGTH);
  
  const countersKeywordsArr = getKeywordsArrFromString(countersKeywords);

  let regexp;
  let locatedStr;
  
  /* try search for each keyword on the page until the first will be found */
  for (let i = 0; i < countersKeywordsArr.length; i++) {
    /* if EOF it cannot locate 128 chars, so null. So maybe do not locate a fixed string. Faced no such cases though */
    regexp = new RegExp(`${countersKeywordsArr[i]}(.{${LOCATED_LENGTH}})`, 's');
    
    locatedStr = str.match(regexp);

    //console.log('locatedStr');
    //console.log(locatedStr);
    
    if (locatedStr !== null)
      return locatedStr[1]; /* [1] - because of we used (group) in RegExp*/
  }

  return locatedStr;
}

/* return a number from a located string `...>999<...` */
function getCounterFromString(str) {
  /* maybe it will be better later (depending on other mfp web servers ) use /<td>\w*(\d+)\w*</td>/ */
  const regExp = />(\d+)</;
  const counter = str.match(regExp);
  
  /* [1] - because of we used (group) in RegExp*/
  return +counter[1];
}

/* return a number (or string) from a located string and appropriate regular expression */
function getConsumableFromString(str, regExp) {
  console.log('str');
  console.log(str);

  console.log('regExp');
  console.log(regExp);
  console.log('str.match(regExp)');
  console.log(str.match(regExp));
  let consumable = str.match(regExp)[1];

  //it might be '99' or 'OK', so used checking for isNaN
  if (+consumable !== +consumable) {
    consumable = convertedConsumableWord(consumable);
  } else {
    consumable = +consumable;
  }
  console.log('consumable');
  console.log(consumable);
  
  return consumable;
}

/* return a number from a located string `...,99]]...` */
/*function getConsumable1FromString(str) {
  const regexp = /,(\d+)\]\]/;
  const counter = str.match(regexp);
  
  return +counter[1];
}*/


/* todo: add this option to existing funcion */
/* return a number from a located string `..."99";...` */
function getConsumable2FromString(str) {
  const regexp = /"(\d+)";/;
  const counter = str.match(regexp);
  
  return +counter[1];
}

/* return a string stauts ('ok', 'buy', 'error' etc) from a located string `...small>OK<small...` */
/*function getConsumable3FromString(str) {
  const regexp = /small>(\w+)<small/;
  const counter = str.match(regexp);
  
  return counter[1];
}*/

/* return a number from a located string `...>99 %<...` */
/*function getConsumable4FromString(str) {
  const regexp = />(\d+) %</;
  const counter = str.match(regexp);
  
  return +counter[1];
}*/

/* input: 'Print cartridge (black)', output: 'Print cartridge \(black\)' 
   A string is used in regular expression, and it interprets it as a new group. 
   Also escaped other regexp reserved characters */
function escapedRegString(str) {
  const escapedRegArr = str.split('');

  for (let i = 0; i < escapedRegArr.length; i++) {
  	switch (escapedRegArr[i].charCodeAt()) {
    	case 36:
    	case 40:
      case 41:
      case 42:
      case 43:
      case 46:
      case 63:
      case 91:
      case 93:
      case 94:
      case 123:
      case 124:
      case 125:
      	escapedRegArr.splice(i, 0, '\\');
      	i++;
      	break;
    }
  }

  return escapedRegArr.join('');
}

/* Some consumable values (i.e. clean cartridge for d95) do not store a number
   It uses keywords like 'OK', 'buy' etc. Let 'OK' be equal to 99% of consumable' capacity, 
   and other keywords as an attention (4%) */
function convertedConsumableWord(consumableWord) {
  let consumableNum;
  
  switch (consumableWord) {
    case 'ok':
    case 'Ok':
    case 'OK':
      consumableNum = 99;
      break;
    default:
      consumableNum = 4;
  }

  return consumableNum;
}

/* input: 'Lala;bebe;toto', output: ['Lala', 'bebe', 'toto'] */
function getKeywordsArrFromString(str) {
  return str.split(";");
}

/* input: ['Lala', 'bebe', 'toto'], output: 'Lala;bebe;toto' */
function updateKeywordsString(countersKeywordsArr) {
  return countersKeywordsArr.join(";");
}

/* fetch data from a full .html webpage and return it*/
async function fetchWebsite(url) {
  /*const options = {
    headers: {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'utf8',
          'encoding': 'binary'
      }
    }
}*/

  return new Promise(function(resolve, reject) {
    const req = http.get(url, async res => {
      //let data = '';
      const chunks = [];

      console.log('res.headers');
      console.log(res.headers);

      //res.setEncoding('utf8');
      //1) utf-8,  2) utf8 3) windows-1251

      /*for await (let chunk of res) {
        data += chunk;
      }*/

      res.on('data', function(chunk) {
        chunks.push(chunk);
      });

      res.on('end', function() {
        const buffer = Buffer.concat(chunks);

        const str = iconv.decode(buffer, 'windows-1251');

        resolve(str);
        //resolve(data);
      });
    });

    /* the only way I know to handle this error. Try, .catch, does not work */
    req.on('error', function(err) {
      reject(new Error('Device server is unreachable, check its network connection and try again later.'));
    });
  });
}

/* get a root folder (directory) of the project */
function getRootDir() {
  return path.dirname(require.main.filename);
}

/* tmp hashing passsword */
function hash(str) {
  return str + '_hashed';
}

/*===========================================================================================================================
                              \|/  start of the password-generetion section of helper functions 
===========================================================================================================================*/
let isSymbolGenerated;

/* generate a password which will contain a letter, a capital letter, a number and a sign */
function generatePassword(length = 8) {
	let password = '';
  
  for (let i = 0; i < length; i++) {
  	if ((i > 0) && (i < length - 1) && (!isSymbolGenerated)) {
    	/* generete a sign between first and last characters */
      password += generateChar(generateNumber(0, 4));
      continue;
    }
    /* generete a letter, a capital letter or a number on the place of first and last characters */
    password += generateChar(generateNumber(0, 3));
  }
  
  /* if a letter, a capital letter, a number or a sign was not genereted, they will be here*/
  while(!passwordCheck(password)) {
  	password = passwordChange(password);
  }
  
  return password;
}

/* depending on the input, generate one character: a letter, a capital letter, a number or a sign */
function generateChar(pos) {
	let generatedChar = '';

	switch (pos) {
  	case 0:
    	generatedChar = generateLetter();
      break;
    case 1:
    	generatedChar = generateLetterCap();
    	break;
    case 2:
    	generatedChar = generateNumber();
      break;
    case 3:
    	generatedChar = generateSymbol();
      break;
  }
  
  return generatedChar;
}

/* generete a letter character */
function generateLetter() {
	let charCode = generateNumber(97, 123);
	return String.fromCharCode(charCode);
}

/* generete a capitel letter character */
function generateLetterCap() {
	let newLetterCap = generateLetter();
  newLetterCap = newLetterCap.toUpperCase();
	return newLetterCap;
}

/* generete a sign character */
function generateSymbol() {
	isSymbolGenerated = true;
	return '-';
}

/* generete a number character */
function generateNumber(min = 0, max = 10) {
  let x = Math.floor(Math.random() * (max - min) + min);
  return x;
}

/* get a meta-info about a password in an orginized array of arrays of positions, 
 * where a letter, a capital letter, a number or a sign was(not) generated */
function getPassSchema(str) {
	let letters = [];
  let lettersCapital = [];
  let numbers = [];
  let symbols = [];
  let schema = [letters, lettersCapital, numbers, symbols];
  
  for (let i = 0; i < str.length; i++) {
  	if ((str[i] >= 0) && (str[i] <= 9)) {
    	numbers.push(i);
      continue;
    }
    
    charCode = str[i].charCodeAt(0);
    
    if ((charCode >= 97 ) && (charCode <= 122)) {
    	letters.push(i);
      continue;
    }
    
    if (str[i] === '-') {
    	symbols.push(i);
      continue;
    }
    
		lettersCapital.push(i);
  }
  
  return schema;
}

/* if a password miss a letter, a capital letter, a number or a sign, return false */
function passwordCheck(str) {
	let passSchema = getPassSchema(str);
  let isProper = true;
  
  for (let i = 0; i < passSchema.length; i++) {
  	if (passSchema[i].length == 0) {
    	isProper = false;
    }
  }
  
  return isProper;
}

/* edit generated password and fix possibly missing characters (a letter etc.) */
function passwordChange(str) {
	let passSchema = getPassSchema(str);
	let maxSchemaEl;
  let newChar;
  let newPos;
  
  for(let i = 0; i < passSchema.length; i++) {
  	passSchema = getPassSchema(str);
    /* get info (out of schema) about which category of characters is the biggest */
  	maxSchemaEl = passSchema.reduce((maxEl, item, index) => {
  		if (item.length > maxEl.length) {
    		maxEl.pos = index;
      	maxEl.length = item.length;
    	}
    
    	return maxEl;
  	}, {pos: 0, length: passSchema[0].length});

    /* if some category is completely absent, we take a random position of the biggest category 
     * and generate character from absent category on its place */
    if (passSchema[i].length === 0) {
    	newChar = generateChar(i);
      newPos = generateNumber(0, maxSchemaEl.length);
      
      /* for a sign category (#3) we don't want to generete a sign on the first and last positions */
      if (i === 3) {
      	while((passSchema[maxSchemaEl.pos][newPos] == 0) ||
          (passSchema[maxSchemaEl.pos][newPos] == (str.length - 1))) {
          newPos = generateNumber(0, maxSchemaEl.length);
    		}
      }
      
      str = changePassLetter(str, passSchema[maxSchemaEl.pos][newPos], newChar);
    }
  }
  
  return str;
}

/* a custom function to replace a character in a string */
function changePassLetter(str, pos, newChar) {
	const arr = str.split('');
  arr[pos] = newChar;
  str = arr.join('');
  
  return str;
}
/*===========================================================================================================================
                              /|\  end of the password-generation section of helper functions
===========================================================================================================================*/

module.exports = {
  emptyArrOrRows,
  escapedRegString,
  fetchWebsite,
  generatePassword,
  getCounterFromString,
  getConsumableFromString,
  //getConsumable1FromString,
  getConsumable2FromString,
  //getConsumable3FromString,
  //getConsumable4FromString,
  getKeywordsArrFromString,
  getOffset,
  getRootDir,
  hash,
  locateCounter,
  updateKeywordsString
};
