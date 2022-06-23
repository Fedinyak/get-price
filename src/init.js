import * as XLSX from 'xlsx/xlsx.mjs';

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

        // "Лист1" "ЭЛЕКТРА"
        // "TDSheet" "Лезард"

        // displaying the json result
        const getResult = (data) => {
          if (data.TDSheet !== undefined) {
            const obj = data.TDSheet;
            console.log(data);

            const userPercentage = document.querySelector('.percentage');
            const percentage = userPercentage.value;

            const getDiscountPrice = (sum, count) => {
              let result = 0;
              if (sum !== undefined) {
                const strWithoutSpace = sum.replace(/ /g, '');
                const strWithDot = strWithoutSpace.replace(',', '.');
                const finalNum = parseFloat(strWithDot);
                result += finalNum;
              }
              return result / parseFloat(count);
            };

            const filtedItem = obj.filter((item) => !isNaN(item.__EMPTY_1));

            const finalResult = filtedItem.map((item) => {
              const discountPrice = getDiscountPrice(
                item.__EMPTY_66,
                item.__EMPTY_32,
              );
              const sellPrice = discountPrice + (discountPrice / 100) * percentage;
              return {
                '№': item.__EMPTY_1,
                Артикул: item.__EMPTY_3,
                'Товары (работы, услуги)': item.__EMPTY_6,
                Количество: item.__EMPTY_32,
                Цена: item.__EMPTY_42,
                'Сумма\nбез скидки': item.__EMPTY_50,
                Скидка: item.__EMPTY_58,
                Сумма: item.__EMPTY_66,
                'Цена со скидкой, шт': discountPrice.toFixed(2),
                'Цена с наценкой, шт': sellPrice.toFixed(2),
              };
            });
            return finalResult;
          } if (data['Лист1'] !== undefined) {
            return data;
          }
        };

        const resultEle = document.getElementById('json-result');
        resultEle.value = JSON.stringify(getResult(result), null, 4);
        // resultEle.value = JSON.stringify(result, null, 4);

        resultEle.style.display = 'block';
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
