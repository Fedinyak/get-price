const renderPrice = (state) => {
  const tableContainer = document.querySelector('.table__container');
  const priseList = document.createElement('ul');
  priseList.className = 'list table-list';

  const postslist = (item) => item.map((
    {
      index, code, goods, count, price, sum, sellPrice,
    },
  ) => {
    const li = document.createElement('li');
    li.className = 'table-item';
    const pIndex = document.createElement('p');
    const pCode = document.createElement('p');
    const pGoods = document.createElement('p');
    const pCount = document.createElement('p');
    const pPrice = document.createElement('p');
    const pSum = document.createElement('p');
    const pSellPrise = document.createElement('p');
    pIndex.className = 'table-item__index index-width';
    pCode.className = 'table-item__code code-width';
    pGoods.className = 'table-item__goods goods-width';
    pCount.className = 'table-item__count count-width';
    pPrice.className = 'table-item__price price-width';
    pSum.className = 'table-item__sum sum-width';
    pSellPrise.className = 'table-item__sell-price sell-price-width';
    pIndex.textContent = index;
    pCode.textContent = code;
    pGoods.textContent = goods;
    pCount.textContent = count;
    pPrice.textContent = price;
    pSum.textContent = sum;
    pSellPrise.textContent = sellPrice;
    li.append(pIndex, pCode, pGoods, pCount, pPrice, pSum, pSellPrise);
    return li;
  });
  tableContainer.innerHTML = '';
  priseList.append(...postslist(state));
  tableContainer.append(priseList);
};

export default renderPrice;
