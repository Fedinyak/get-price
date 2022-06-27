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
  if (state.organization === 'lez') {
    const pickData = data.TDSheet;
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
        // sellPrice: sellPrice.toFixed(2),
      };
    });
    return finalResult;
  }
  const org = state.organization;
  console.log('tetetet', state.data.elKUndef, state.data[org]);
  const pickData = data[state.data[org]];
  const filtedItem = pickData.filter((item) => (!isNaN(item[state.index[state.organization]]) && isNaN(item[state.goods[state.organization]]) && (item[state.index[state.organization]] !== '') && (item[state.index[state.organization]] !== ' ')));
  // const finalResult = filtedItem.map((item) => ({
  //   index: item[state.index.ele],
  //   code: item[state.code.ele],
  //   goods: item[state.goods.ele],
  //   count: item[state.count.ele],
  //   price: item[state.price.ele],
  //   sum: item[state.sum.ele],
  //   sellPrice: sellPrice(item[state.price.ele], percentage),
  //   // sellPrice: sellPrice(item[state.price.ele], percentage),
  // }));
  const getPriceList = (priceList, organization) => priceList.map((item) => ({
    index: item[state.index[organization]],
    code: item[state.code[organization]],
    goods: item[state.goods[organization]],
    count: item[state.count[organization]],
    price: item[state.price[organization]],
    sum: item[state.sum[organization]],
    sellPrice: sellPrice(item[state.price[organization]], percentage),
    // sellPrice: sellPrice(item[state.price.ele], percentage),
  }));
  const finalResult = getPriceList(filtedItem, state.organization);
  return finalResult;
};

export default parsePrise;
