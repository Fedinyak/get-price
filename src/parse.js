import _ from 'lodash';

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

const sellPrice = (num, percentage) => (num + (num / 100) * percentage).toFixed(2);

const parsePrise = (state, percentage, data) => {
  // У входящей эксельке глюк, некоторые ключи в объекте undefined_1
  // Не могу получить ключ undefined, поэтому тут костыли :(
  if (state.organization === 'lez') {
    const pickData = data.TDSheet;
    const getKeys = _.flattenDeep(pickData.map((item) => _.keys(item)));
    console.log(getKeys.indexOf('undefined_26') !== -1);
    if (getKeys.indexOf('undefined_26') !== -1) {
      const filtedItem = pickData.filter((item) => !isNaN(item.__EMPTY));
      const finalResult = filtedItem.map((item) => {
        const discountPrice = getDiscountPrice(
          item[state.sum.lezEnergo],
          item[state.count.lezEnergo],
        );

        return {
          index: item[state.index.lezEnergo],
          code: item[state.code.lezEnergo],
          // У входящей эксельке глюк, некоторые ключи в объекте undefined_1
          // Поэтому название позиции сделал артикулом
          goods: item[state.code.lezEnergo],
          count: item[state.count.lezEnergo],
          priceWithoutDiscount: item.undefined_37,
          sumWithoutDiscount: item.__EMPTY_10,
          discount: item.__EMPTY_18,
          sum: item[state.sum.lezEnergo],
          price: discountPrice.toFixed(2),
          sellPrice: sellPrice(discountPrice, percentage),
        };
      });
      return finalResult;
    }

    const filtedItem = pickData.filter((item) => !isNaN(item.__EMPTY_1));

    const finalResult = filtedItem.map((item) => {
      const discountPrice = getDiscountPrice(
        item[state.sum.lez],
        item[state.count.lez],
      );

      return {
        index: item[state.index.lez],
        code: item[state.code.lez],
        goods: item[state.goods.lez],
        count: item[state.count.lez],
        priceWithoutDiscount: item.__EMPTY_42,
        sumWithoutDiscount: item.__EMPTY_50,
        discount: item.__EMPTY_58,
        sum: item[state.sum.lez],
        price: discountPrice.toFixed(2),
        sellPrice: sellPrice(discountPrice, percentage),
      };
    });
    return finalResult;
  }
  if (state.organization === 'lezEnergo') {
    const pickData = data.TDSheet;
    // У входящей эксельке глюк, некоторые ключи в объекте undefined_1
    // Не могу получить ключ undefined, поэтому тут костыли :(
    const getKeys = _.flattenDeep(pickData.map((item) => _.keys(item)));
    console.log(getKeys.indexOf('undefined_26') !== -1);
    if (getKeys.indexOf('undefined_26') !== -1) {
      const filtedItem = pickData.filter((item) => !isNaN(item.__EMPTY));
      const finalResult = filtedItem.map((item) => {
        const discountPrice = getDiscountPrice(
          item[state.sum.lezEnergo],
          item[state.count.lezEnergo],
        );

        return {
          index: item[state.index.lezEnergo],
          code: item[state.code.lezEnergo],
          // У входящей эксельке глюк, некоторые ключи в объекте undefined_1
          // Поэтому название позиции сделал артикулом
          goods: item[state.code.lezEnergo],
          count: item[state.count.lezEnergo],
          priceWithoutDiscount: item.undefined_37,
          sumWithoutDiscount: item.__EMPTY_10,
          discount: item.__EMPTY_18,
          sum: item[state.sum.lezEnergo],
          price: discountPrice.toFixed(2),
          sellPrice: sellPrice(discountPrice, percentage),
        };
      });
      return finalResult;
    }

    // console.log(data);
    const filtedItem = pickData.filter((item) => !isNaN(item.__EMPTY_1));

    const finalResult = filtedItem.map((item) => {
      const discountPrice = getDiscountPrice(
        item[state.sum.lez],
        item[state.count.lez],
      );

      // const sellPrice = discountPrice + (discountPrice / 100) * percentage;
      return {
        index: item[state.index.lez],
        code: item[state.code.lez],
        goods: item[state.goods.lez],
        count: item[state.count.lez],
        priceWithoutDiscount: item.__EMPTY_42,
        sumWithoutDiscount: item.__EMPTY_50,
        discount: item.__EMPTY_58,
        sum: item[state.sum.lez],
        price: discountPrice.toFixed(2),
        sellPrice: sellPrice(discountPrice, percentage),
      };
    });
    return finalResult;
  }
  const org = state.organization;
  const pickData = data[state.data[org]];
  const filtedItem = pickData.filter((item) => (!isNaN(item[state.index[state.organization]]) && isNaN(item[state.goods[state.organization]]) && (item[state.index[state.organization]] !== '') && (item[state.index[state.organization]] !== ' ')));
  const getPriceList = (priceList, organization) => priceList.map((item) => ({
    index: item[state.index[organization]],
    code: item[state.code[organization]],
    goods: item[state.goods[organization]],
    count: item[state.count[organization]],
    price: item[state.price[organization]],
    sum: item[state.sum[organization]],
    sellPrice: sellPrice(item[state.price[organization]], percentage),
  }));
  const finalResult = getPriceList(filtedItem, state.organization);
  return finalResult;
};

export default parsePrise;
