    window.addEventListener('DOMContentLoaded', function() {
     this.partnerCard = [];
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
    function shuffle() {
        let i = cards.length;
        while (i) {
            let index = Math.floor(Math.random() * i--);
            var temp = cards[index];
            cards[index] = cards[i];
            cards[i] = temp;
        }
    }

    shuffle();
    //TODO:class化できそう。。
    //自分の手札生成
    const myTable = document.getElementById('my-table');
    for (let i = 0; i < 1; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            td.classList.add('card');
            td.onclick = flip;
           
            let tempCard = '';
            tempCard =cards[j];

            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;

            td.setAttribute("id",`${tempCard.num}`);
            tr.setAttribute("id",`my_tr`);
            tr.appendChild(td);
                myTable.appendChild(tr);

        }
    }
//相手手札の生成
    const partnerTable = document.getElementById('partnerーtable');
    for (let i = 0; i < 1; i++) {
        let tr = document.createElement('tr');
        for (let j = 5; j < 10; j++) {
            let td = document.createElement('td');
            //TODO::jだけで良くない？？
            let tempCard = cards[j];
            
            td.classList.add('card', 'partner');
            td.onclick = flip;
            
            //以下を追加
            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;
            
            //一致したものを削除できるようにカードの数字を付与
            td.setAttribute("id",`${tempCard.num}`);
            tr.appendChild(td);
            // let array = 1;
            partnerCard.push(td.style.backgroundImage);
            partnerTable.appendChild(tr);
        }
    }

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
        console.log(card.target.id);
        console.log(card);
        // 追加
        // https://js.studio-kingdom.com/javascript/node/insert_before
        insertedElement = parentDiv2.insertBefore(td, myCard);
        insertedElement.setAttribute("id",`${card.target.id}`);
    }

    //以下の変数を追加
    let firstCard = null;
    let flipTimerId = NaN;

    function flip(cards) {
        let td = cards.target;

        //クリックしたカードを引く。
        
        //以下を追記
        if (!td.classList.contains('back') || flipTimerId) {
            return;//表のカードをクリックしても何もしない。
        }
        td.classList.remove('back');//カードを表にする。
        getCard(cards);
        // if (firstCard === null) {
        //     firstCard = td;//1枚目だったら今めくったカードをfirstCardに設定
        // } else {
            //2枚目だったら1枚目と比較して結果を判定する。
            // if (firstCard.num === td.num) {
            //     //２枚が同じだったときの処理
            //     firstCard = null;
            // } else {
            //     flipTimerId = setTimeout(function () {
            //         firstCard.classList.add('back');
            //         td.classList.add('back');
            //         flipTimerId = NaN;
            //         firstCard = null;
            //     }, 1200);
            // }


        // }
    }
});
