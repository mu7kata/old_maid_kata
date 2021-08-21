window.addEventListener('DOMContentLoaded', function () {
    function Card(suit, num) {
        this.suit = suit;
        this.num = num;
        this.front;
        this.setFront = function () {
            this.front = `${this.suit}${('0' + this.num).slice(-2)}.gif`;
            // this.front; let test = document.querySelector('.back');
        };
    }
    const cards = [];
    const suits = ['s', 'd', 'h', 'c'];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 1; j <= 12; j++) {
            let card = new Card(suits[i], j);
            card.setFront();
            cards.push(card);
        }
    }
    // //いらないかも
    // function shuffle() {
    //     let i = cards.length;
    //     while (i) {
    //         let index = Math.floor(Math.random() * i--);
    //         var temp = cards[index];
    //         cards[index] = cards[i];
    //         cards[i] = temp;
    //     }
    // }

    // shuffle();
    // TODO:class化できそう。。





    //自分の手札生成
    const myTable = document.getElementById('my-table');
    const myNums = [];
    for (let i = 0; i < 1; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            let tempCard = '';
            tempCard = cards[j];
            td.classList.add('card');
            td.onclick = flip;
            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;
            // let num = \\``.tempCard.num;
            td.setAttribute("id", `no-${tempCard.num}`);
            myNums.push(tempCard.num);
            tr.setAttribute("id", `my_tr`);
            tr.appendChild(td);
            myTable.appendChild(tr);
        }
    }
    // console.log(cardss[0].querySelector("no8"));
    // 要素の取得→配列に格納⇨配列の中身。重複削除？？
    // 要素の取得→ループで削除？？
    //相手手札の生成
    const partnerTable = document.getElementById('partnerーtable');
    const paNums = [];
    for (let i = 0; i < 1; i++) {
        let tr = document.createElement('tr');
       
        for (let j = 24; j < 29; j++) {
            let td = document.createElement('td');
            //TODO::jだけで良くない？？
            let tempCard = cards[j];
            td.classList.add('card', 'partner', 'back');
            td.onclick = flip;
            //以下を追加
            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;
            //一致したものを削除できるようにカードの数字を付与
            td.setAttribute("id", `no-${tempCard.num}`);
            paNums.push(tempCard.num);
            tr.appendChild(td);
            partnerTable.appendChild(tr);
        }
    }

    function addNextButton(){
        const container = document.getElementById('container');
        let tees = document.createElement('button');
        tees.setAttribute("id", `next`);
        container.insertBefore(tees,null);
        let text = document.createTextNode('次へ');
        //アンカータグにテキストノード追加
        tees.appendChild(text);
        const test = document.getElementById("next");
        test.addEventListener("click", event => {
            
        });
    }

    function removeDupCard(cardId) {
        let cardss = document.querySelector(`#my-table #${cardId}`);
        // let cardss2 = document.querySelector(`#my-table #${cardId}`);
        // console.log(cardss2);
        cardss.parentNode.removeChild(cardss);
        // cardss.parentNode.removeChild(cardss2);
    }

    // removeDupCard('partnerーtable',paNums);
    // removeDupCard('myーtable',myNums);

    //指定のカードを追加する処理
    function getCard(card) {
        //https://itsakura.com/js-queryselectorall
        //https://www.javadrive.jp/javascript/dom/index28.html
        let style = getComputedStyle(card.target);
        let imageUrl = style.getPropertyValue('background-image');
        card.target.remove();
        // 手札の数をカウント、取得したカードの配置場所を決めるため
        myCardCount = document.querySelectorAll('#my_tr .card').length;

        //クラス、ID付与
        let td = document.createElement('td');
        td.classList.add('card');
        // td.setAttribute("id",`my_card.${myCardCount}`);
        td.style.backgroundImage = imageUrl;

        //自分のテーブルに追加
        let parentDiv2 = document.getElementById("my_tr");
        let myCard = document.getElementById(`my_card.${myCardCount}`);

        // 追加
        // https://js.studio-kingdom.com/javascript/node/insert_before
        insertedElement = parentDiv2.insertBefore(td, myCard);
        insertedElement.setAttribute("id", `${card.target.id}`);

        //重複チェック自分のと、相手のを削除。。

    }

    //以下の変数を追加
    let firstCard = null;
    let flipTimerId = NaN;

    function flip(cards) {
        let td = cards.target;

        //表にしたカードを取得、削除する
        if (td.classList.contains('back')) {
            td.classList.add('open');
        }else{
            getCard(cards);
            removeDupCard(cards.target.id);
            removeDupCard(cards.target.id);
            addNextButton();
        }

        td.classList.remove('back');//カードを表にする。

        // if (!td.classList.contains('back') || flipTimerId) {
        console.log("クリックされました");
    }


    // button.addEventListener("click", event => {
    //     console.log("クリックされました");
    // });



    // //いらないかも。。
    // function removeDupCard(paramNums) {
    // const parent = document.getElementById(table);
    // const nums = paramNums;
    //     // for (let i = 0; i < 5; i++) {
    //         let cardss = document.getElementById(`no-${nums[i]}`);
    //         for (let i = 0; i < nums.length; i++) {
    //             if (cardss != null  ) {
    //                 if (`no-${nums[i]}` == cardss.id) {
    //                     cardssw = document.getElementById(`no-${nums[i]}`);
    //                     if(cardssw != null){
    //                         cardssw.parentNode.removeChild(cardssw);
    //                     }
    //                 }
    //             }
    //         }
    //     }
});
