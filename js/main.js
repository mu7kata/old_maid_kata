window.onload = function () {
    function Card(suit, num) {
        this.suit = suit;
        this.num = num;
        this.front;
        this.setFront = function () {
            this.front = `${this.suit}${('0' + this.num).slice(-2)}.gif`;
            this.front; let test = document.querySelector('.back');
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
    const partnerTable = document.getElementById('partnerーtable');
    for (let i = 0; i < 1; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            let tempCard = cards[i * 13 + j];
            td.classList.add('card', 'back', 'partner');
            td.onclick = flip;
            //以下を追加
            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;
            tr.appendChild(td);
        }

        partnerTable.appendChild(tr);
    }

    //TODO:class化できそう。。
    const myTable = document.getElementById('my-table');
    for (let i = 0; i < 1; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            let tempCard = cards[i * 13 + j];
            td.classList.add('card');
            td.onclick = flip;
            //以下を追加
            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;
            td.setAttribute("id",`my_card.${j}`);
            tr.setAttribute("id",`my_tr`);
            tr.appendChild(td);
        }


        myTable.appendChild(tr);
    }



    // カードのDOMを取得
    let card = document.getElementsByClassName('card');

    // カードの個数分ループ
    // 変数「i」に現在のループ回数が代入される
    // https://www.mdn.co.jp/di/contents/4047/54019/
    //TODO:querySelectorAllでいけるかも
    for (let i = card.length - 1; i >= 0; i--) {
        // console.log(card);
        // 各ボタンをイベントリスナーに登録


        card[i].addEventListener("click", function () {
            getCard(card[i]);
            card[i].remove();
        });
    }

    //指定のカードを追加する処理
    function getCard(card) {
        //https://itsakura.com/js-queryselectorall
        //https://www.javadrive.jp/javascript/dom/index28.html
        let style = getComputedStyle(card);
        let imageUrl = style.getPropertyValue('background-image');

        let td = document.createElement('td');
        td.classList.add('card');
        td.style.backgroundImage = imageUrl;

//自分のテーブルに追加
        let parentDiv2 = document.getElementById("my_tr");
        console.log(parentDiv2);
        // 子要素３への参照を取得
        let myCard = document.getElementById("my_card.3");
        // 追加
        parentDiv2.insertBefore(td, myCard);
    }

    //以下の変数を追加
    let firstCard = null;
    let flipTimerId = NaN;

    function flip(e) {
        let td = e.target;

        //下の一行をコメントアウト
        //td.classList.toggle('back');
        //以下を追記
        if (!td.classList.contains('back') || flipTimerId) {
            return;//表のカードをクリックしても何もしない。
        }
        td.classList.remove('back');//カードを表にする。
        if (firstCard === null) {
            firstCard = td;//1枚目だったら今めくったカードをfirstCardに設定
        } else {
            //2枚目だったら1枚目と比較して結果を判定する。
            if (firstCard.num === td.num) {
                //２枚が同じだったときの処理
                firstCard = null;
            } else {
                flipTimerId = setTimeout(function () {
                    firstCard.classList.add('back');
                    td.classList.add('back');
                    flipTimerId = NaN;
                    firstCard = null;
                }, 1200);
            }


        }
    }
}
