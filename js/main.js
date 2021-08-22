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
    const myCards = [];

        for (let j = 1; j <= 5; j++) {
            let card = new Card('h', j);
            card.setFront();
            myCards.push(card);
        }
    // }
    const paCards = [];
        for (let j = 1; j <= 5; j++) {
            let card = new Card('c', j);
            card.setFront();
            paCards.push(card);
        }
    console.log(myCards)
    // //いらないかも
    function shuffle(cards) {
        let i = cards.length;

        while (i) {
            let index = Math.floor(Math.random() * i--);
            var temp = cards[index];
            cards[index] = cards[i];
            // console.log(temp,index);
            cards[i] = temp;
        }
    }

    shuffle(myCards);
    shuffle(paCards);
    // TODO:class化できそう。。





    //自分の手札生成
    const myTable = document.getElementById('my-table');
    for (let i = 0; i < 1; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            let tempCard = '';
            tempCard = myCards[j];
            td.classList.add('card');
            td.onclick = flip;
            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;
            // let num = \\``.tempCard.num;
            // td.classList.add(`no-${tempCard.num}`);
            td.classList.add('card', `no-${tempCard.num}`, 'me', 'noTouch');
            tr.setAttribute("id", `my_tr`);
            tr.appendChild(td);
            myTable.appendChild(tr);
        }
    }

    function setJoker(tr) {
        // .children[1]
        console.log(tr);
        let td = document.createElement('td');
        td.style.backgroundImage = `url(images/x02.gif)`;
        td.onclick = flip;
        tr.setAttribute("id", `pa_tr`);
        td.classList.add('card', `no-100`, 'partner', 'back');
        // tr.appendChild(td);
        let randomNum = Math.floor(Math.random() * tr.children.length);
        let insertBeforeTd = tr.children[randomNum];
       tr.insertBefore(td, insertBeforeTd);
    }

    //相手手札の生成
    const partnerTable = document.getElementById('partnerーtable');
    for (let i = 0; i < 1; i++) {
        let tr = document.createElement('tr');

        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            //TODO::jだけで良くない？？

            let tempCard = paCards[j];
            td.classList.add('card', `no-${tempCard.num}`, 'partner','back');

            td.onclick = flip;
            //以下を追加
            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;
            //一致したものを削除できるようにカードの数字を付与
            // td.classList.add();
            tr.setAttribute("id", `pa_tr`);
            tr.appendChild(td);
            partnerTable.appendChild(tr);
        }
        setJoker(tr);
    }



    //相手のターン処理のためのボタン追加
    function addNextButton() {
        const container = document.getElementById('container');
        let tees = document.createElement('button');
        tees.setAttribute("id", `next`);
        container.insertBefore(tees, null);
        let text = document.createTextNode('次へ');
        //アンカータグにテキストノード追加
        tees.appendChild(text);
        const test = document.getElementById("next");
        test.addEventListener("click", event => {

        });

        let classNames = [];
        let xtd = '';
        const button = document.getElementById("next");
        button.addEventListener("click", event => {
            let atr = document.querySelector(`#my_tr`);

            if (classNames.length == 0) {
                classNames = [];
                for (i = 0; i < atr.children.length; i++) {
                    let className = atr.children[i].className.split(' ')[1];
                    classNames.push(className);
                }
                let a = classNames[Math.floor(Math.random() * classNames.length)];
                xtd = document.querySelector(`#my_tr .${a}`);
            }

            if (xtd.classList.contains('noTouch')) {
                xtd.classList.add('open');
                xtd.classList.remove('noTouch');
            } else {
                let getId = getCard(xtd, '#my_tr');
                cardClass = xtd.className.split(' ')[1]

                // ばばだったら処理終了
                if (cardClass == 'no-100') {

                    return;
                }

                removeDupCard(cardClass, getId);
                button.parentNode.removeChild(button);
            }
        });
    }

    //自分のカードを削除
    function removeDupCard(cardClass, parentId) {
        //1回目で相手から取ったカードを。２回目で自分のカードを削除する。
        for (let i = 0; i <= 1; i++) {
            let cardss = document.querySelector(`#${parentId} .${cardClass}`);

            cardss.parentNode.removeChild(cardss);
        }
    }


    //指定のカードを追加する処理
    function getCard(ctd, trId) {
        //https://itsakura.com/js-queryselectorall
        //https://www.javadrive.jp/javascript/dom/index28.html

        let style = getComputedStyle(ctd);
        let imageUrl = style.getPropertyValue('background-image');
        ctd.remove();

        //クラス、ID付与
        let td = document.createElement('td');
        let class_name = ctd.className.split(' ');

        td.classList.add('card', class_name[1]);
        td.style.backgroundImage = imageUrl;

        let parentDiv2 = document.getElementById('pa_tr');;
        if (trId == 'pa_tr') {
            //カードを引いた人のテーブルに追加
            parentDiv2 = document.getElementById('my_tr');
        }
        td.onclick = flip;
        insertedElement = parentDiv2.insertBefore(td, null);
        return parentDiv2.id;
        //重複チェック自分のと、相手のを削除。。
    }

    //以下の変数を追加
    let firstCard = null;
    let flipTimerId = NaN;

    function flip(cards) {

        let td = cards.target;
        let tdParent = document.getElementsByClassName(td.className)[0];
        let trParent = tdParent.parentNode;
        //表にしたカードを取得、削除する
        if (td.classList.contains('back') || td.classList.contains('noTouch')) {
            td.classList.add('open');
        } else {
            let cardClass = cards.target.className.split(' ');
            let getId = getCard(td, trParent.id);

            addNextButton();

            //ばばだったら処理終了
            if (cardClass[1] == 'no-100') {
                return;
            }
            removeDupCard(cardClass[1], getId);
        }

        td.classList.remove('back');//カードを表にする。
        td.classList.remove('noTouch');//カードを表にする。

        // if (!td.classList.contains('back') || flipTimerId) {

    }



});


//シャッフル機能
//一回取得したカードを取らせ得る