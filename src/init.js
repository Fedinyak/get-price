import * as XLSX from 'xlsx/xlsx.mjs';
import _ from 'lodash';
import parsePrise from './parse';
import renderPrice from './render';

const state = {
  organization: null,
  organizationId: {
    ele: '77  34  40955  1',
    lez: '5410062881',
    elK: '7714328576',
    elKUndef: 'undefined_37',
    elKEmpty: '__EMPTY_38',
  },
  code: {
    ele: '__EMPTY_4',
    lez: '__EMPTY_3',
    elKUndef: 'undefined_2',
    elKEmpty: '__EMPTY_3',
  },
  index: {
    ele: 'Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате \n обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается по факту\n прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта.',
    lez: '__EMPTY_1',
    elKUndef: 'Внимание! Счет действителен в течение 24-х часов! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается по факту прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта. Оплаченный товар хранится на нашем складе в течение 5 рабочих дней.',
    elKEmpty: 'Внимание! Счет действителен в течение 24-х часов! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается по факту прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта. Оплаченный товар хранится на нашем складе в течение 5 рабочих дней.',
  },
  goods: {
    ele: '__EMPTY',
    lez: '__EMPTY_6',
    elKUndef: 'undefined_10',
    elKEmpty: '__EMPTY_11',
  },
  count: {
    ele: '__EMPTY_7',
    lez: '__EMPTY_32',
    elKUndef: 'undefined_42',
    elKEmpty: '__EMPTY_43',
  },
  price: {
    ele: '__EMPTY_8',
    elKUndef: 'undefined_46',
    elKEmpty: '__EMPTY_47',
  },
  sum: {
    ele: '__EMPTY_9',
    lez: '__EMPTY_66',
    elKUndef: 'undefined_52',
    elKEmpty: '__EMPTY_53',
  },
  data: {
    ele: 'Лист1',
    elKUndef: 'TDSheet',
    elKEmpty: 'TDSheet',
  },
};

const getOrganization = (data) => {
  // "Лист1" "ЭЛЕКТРА"        --- '77  34  40955  1'
  // "TDSheet" "Лезард"       --- '5410062881'
  // "TDSheet:"               --- '7714328576'
  // Распарсенная экселька
  // Выбрать какой поставщик
  // Просчитать
  // Вывести
  const resultValue = [];
  const values = Object.values(data);
  values.map((obj) => obj.map((item) => resultValue.push(Object.values(item))));
  const flatVaues = _.flattenDeep(resultValue);
  if (_.includes(flatVaues, state.organizationId.ele)) {
    state.organization = 'ele';
    return;
  }
  if (_.includes(flatVaues, state.organizationId.lez)) {
    state.organization = 'lez';
    return;
  }
  if (_.includes(flatVaues, state.organizationId.elK)) {
    const keyValues = Object.values(data);
    const keyResult = {};
    keyValues.map((obj) => obj.map((item) => _.merge(keyResult, item)));
    if (_.has(keyResult, state.organizationId.elKUndef)) {
      state.organization = 'elKUndef';
      return;
    }
    if (_.has(keyResult, state.organizationId.elKEmpty)) {
      state.organization = 'elKEmpty';
      return;
    }
    state.organization = 'elK';
    return;
  }
  state.organization = 'notSupport';
};

const runApp = () => {
  // Method to read excel file and convert it into JSON
  function excelFileToJSON(file) {
    try {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
          type: 'binary',
        });
        const result = {};
        workbook.SheetNames.forEach((sheetName) => {
          const roa = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName],
          );
          if (roa.length > 0) {
            result[sheetName] = roa;
          }
        });

        // displaying the json result
        const getPrice = (data) => {
          getOrganization(data);
          console.log(state);
          const userPercentage = document.querySelector('.percentage');
          const percentage = userPercentage.value;

          return parsePrise(state, percentage, data);
          // return data;
        };

        // const resultEle = document.getElementById('json-result');
        // resultEle.value = JSON.stringify(getPrice(result), null, 4);

        // resultEle.value = JSON.stringify(result, null, 4);

        // resultEle.style.display = 'block';

        renderPrice(getPrice(result));
      };
    } catch (e) {
      console.error(e);
    }
  }

  // Method to upload a valid excel file
  function upload() {
    const { files } = document.getElementById('file_upload');
    if (files.length === 0) {
      alert('Please choose any file...');
      return;
    }
    const filename = files[0].name;
    const extension = filename
      .substring(filename.lastIndexOf('.'))
      .toUpperCase();
    if (extension === '.XLS' || extension === '.XLSX') {
      excelFileToJSON(files[0]);
    } else {
      alert('Please select a valid excel file.');
    }
  }

  const formElement = document.querySelector('.price-form');
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    upload();
  });

  return upload;
};

export default runApp;
