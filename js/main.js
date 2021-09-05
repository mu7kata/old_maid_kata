addEventListener('DOMContentLoaded', function () {
    class Card {
        constructor(suit, num) {
            this.suit = suit;
            this.num = num;
            this.front;
            this.setFront = function () {
                this.front = `${this.suit}${('0' + this.num).slice(-2)}.gif`;
            };
        }
    }

    function generateCard(cards) {

        // カードの取得
        for (let j = 1; j <= 5; j++) {
            let card = new Card('h', j);
            card.setFront();
            cards.push(card);
        }

        //カードをランダム配置
        let i = cards.length;
        while (i) {
            let index = Math.floor(Math.random() * i--);
            var temp = cards[index];
            cards[index] = cards[i];
            cards[i] = temp;
        }
    }

    // TODO:class化できそう。。
    //自分の手札生成
    function madeMyTable() {
        const myCards = [];
        generateCard(myCards);

        const myTable = document.getElementById('my-table');
        let tr = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            let tempCard = myCards[j];
            td.classList.add('card', `no-${tempCard.num}`, 'my', 'noTouch');
            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;
            tr.setAttribute("id", `my_tr`);
            tr.appendChild(td);
            myTable.appendChild(tr);
        }
    }

    madeMyTable();

    function setJoker(tr) {
        let td = document.createElement('td');
        td.style.backgroundImage = `url(images/x02.gif)`;

        tr.setAttribute("id", `pa_tr`);
        td.classList.add('card', `no-100`, 'partner', 'back');

        let randomNum = Math.floor(Math.random() * tr.children.length);
        let insertBeforeTd = tr.children[randomNum];
        tr.insertBefore(td, insertBeforeTd);
        cardHover(td);
    }

    //カードにカーソルがあった時、変化させる
    function cardHover(td) {
        td.addEventListener('mouseenter', () => {
            td.classList.add('hover');
        }, false);
        td.addEventListener('mouseout', () => {
            td.classList.remove('hover');
        }, false);
    }
    //相手手札の生成
    function maidPartnerTable() {
        const partnerTable = document.getElementById('partnerーtable');
        const paCards = [];
        generateCard(paCards);
        let tr = document.createElement('tr');

        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            let tempCard = paCards[j];
            td.classList.add('card', `no-${tempCard.num}`, 'partner', 'back');
            // td.setAttribute("onmouseover", mouseover);
            //以下を追加
            td.num = tempCard.num;
            td.style.backgroundImage = `url(images/${tempCard.front})`;
            //一致したものを削除できるようにカードの数字を付与
            tr.setAttribute("id", `pa_tr`);
            tr.appendChild(td);
            partnerTable.appendChild(tr);
            // カードに触れた時の挙動変更   
            cardHover(td);
        }

        setJoker(tr);
    }
    maidPartnerTable();

    cardClick();

    //相手のターン処理のためのボタン追加
    function addNextButton() {
        const container = document.getElementById('container');
        //「次へ」ボタン作成
        let nextButton = document.createElement('button');
        nextButton.setAttribute("id", `next`);
        container.insertBefore(nextButton, null);
        let text = document.createTextNode('次へ');
        nextButton.appendChild(text);

        let classNames = [];
        let targetTd = '';

        nextButton.addEventListener("click", event => {
            let targetTr = document.querySelector(`#my_tr`);
            //ひくカードをランダムで決める
            if (classNames.length == 0) {
                classNames = [];
                for (i = 0; i < targetTr.children.length; i++) {
                    let className = targetTr.children[i].className.split(' ')[1];
                    classNames.push(className);
                }
                let className = classNames[Math.floor(Math.random() * classNames.length)];
                targetTd = document.querySelector(`#my_tr .${className}`);

            }

            if (targetTd.classList.contains('noTouch')) {
                targetTd.classList.add('open');
                targetTd.classList.remove('noTouch');
            } else {
                let getId = getCard(targetTd, 'my_tr');
                cardClass = targetTd.className.split(' ')[1]

                // ばば以外だったら重複削除
                if (cardClass != 'no-100') {
                    removeDupCard(cardClass, getId);
                }

                cardClick();

                //ボタン削除
                nextButton.parentNode.removeChild(nextButton);
                let noClickes = document.querySelectorAll('.noclick');
                for (i = 0; i < noClickes.length; i++) {
                    noClickes[i].classList.remove('noclick');
                }
            }


        });
    }

    //自分のカードを削除
    function removeDupCard(cardClass, parentId) {
        //ループ1回目で相手から取ったカードを。ループ２回目で自分のカードを削除する。
        for (let i = 0; i <= 1; i++) {
            let targetCards = document.querySelector(`#${parentId} .${cardClass}`);

            targetCards.parentNode.removeChild(targetCards);
        }
    }


    //指定のカードを追加する処理
    function getCard(targetTd, trId) {
        let style = getComputedStyle(targetTd);
        let imageUrl = style.getPropertyValue('background-image');
        targetTd.remove();

        //クラス、ID付与
        let td = document.createElement('td');
        let class_name = targetTd.className.split(' ');

        td.classList.add('card', class_name[1]);
        td.style.backgroundImage = imageUrl;

        let parentDiv2 = document.getElementById('pa_tr');;
        if (trId == 'pa_tr') {
            //カードを引いた人のテーブルに追加
            parentDiv2 = document.getElementById('my_tr');
        }

        //相手が引いた時ばばだったら裏返す
        if (trId == 'my_tr' && targetTd.className == 'card no-100') {
            td.classList.add('back');
        }

        insertedElement = parentDiv2.insertBefore(td, null);

        return parentDiv2.id;
        //重複チェック自分のと、相手のを削除。。
    }


    function cardClick() {
        const tg = document.querySelector(`#pa_tr`);
        let count = tg.children.length
        for (i = 0; i < count; i++) {
            let car = tg.children[i];
            car.onclick = function (cards) {
                let td = cards.target;

                let tdParent = document.getElementsByClassName(td.className)[0];
                let trParent = tdParent.parentNode;

                //表にしたカードを取得、削除する
                if (td.classList.contains('back') || td.classList.contains('noTouch')) {
                    td.setAttribute('id', 'open');
                } else {
                    let cardClass = cards.target.className.split(' ');
                    let getId = getCard(td, trParent.id);

                    addNextButton();

                    //ばばだったら処理終了
                    if (cardClass[1] != 'no-100') {
                        removeDupCard(cardClass[1], getId);
                    }
                }

                let noclick = document.querySelectorAll('#pa_tr :not(#open)');
                for (i = 0; i < noclick.length; i++) {
                    noclick[i].classList.add('noclick');
                }

                td.classList.remove('back');//カードを表にする。
                td.classList.remove('noTouch');
            }
        }
    }

    function matchResult() {
        let test = document.querySelectorAll('.card');
        let joker = document.querySelectorAll('.no-100');
        //最後の一枚になった時、ジョーカーを保持しているかどうかで勝敗の決定
        if (test.length == 1) {
            const result = document.querySelector(`#result`);
            if (joker[0].parentNode.id == 'pa_tr') {
                //裏返ったままなので表にする
                joker[0].classList.remove('back');
                result.innerHTML = "Your WIN!!!";
            } else {
                result.innerHTML = "Your Lose....";
            }
        }
    }

    var div = document.getElementsByTagName('div')[0];
    var mo = new MutationObserver(function () {
        matchResult();
    });
    var config = {
        childList: true
    };
    //勝敗の判定
    mo.observe(div, config);
});


// キャラ選択処理
// 相手のターン処理自動処理
// ターン切り替わりエフェクト
