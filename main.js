// API提供サイト：https://opentdb.com/api_config.php
// スコープの汚染を防ぐため即時関数を使用
(() => {
  const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

  // gameState : クイズアプリのデータ管理用オブジェクト
  //   quizzes : fetchで取得したクイズデータの配列(resutls)を保持
  //   currentIndex : 現在何問目のクイズに取り組んでいるのかをインデックス番号で保持する
  //   numberOfCorrects : 正答数を保持する
  const gameState = {
    quizzes : [],
    currentIndex : 0,
    numberOfCorrects : 0
  };

  // id値でDOM取得
  const questionElement = document.getElementById('question');
  const resultElement = document.getElementById('result');
  const answersContainer = document.getElementById('answers');
  const restartButton = document.getElementById('restart-button');

  // ページの読み込みが完了したらクイズ情報を取得
  window.addEventListener('load', (event) => {
    fetchQuizData();
  });

  // Restartボタンをクリックしたら、fetchQuizData関数 を実行
  restartButton.addEventListener('click', (event) => {
    fetchQuizData();
  });


  // 新しいクイズデータを取得する fetchQuizData関数 の中身
  //   機能：Webページ上の表示をリセットし、APIから新たなクイズデータを取得する
  //        id 'question' 要素に「Now loading...」を表示
  //        id 'result' 要素に空文字列をセットする
  //        id 'restart-button' 要素を非表示にする
  const fetchQuizData = async () => {
    questionElement.textContent = 'Now loading...';
    resultElement.textContent = '';
    restartButton.hidden = true;

  //   クイズ取得の流れを非同期処理で実装する
  //     1. API_URLとfetchメソッドを使ってAPI経由でデータを取得する
  //     2. fetchメソッドで取得したResponseデータからJSON形式のデータをオブジェクトに変換する
  //     3. 2で取得したJSONデータ内のresultsプロパティ(配列)があり、その中には10個のクイズデータがある。
  //        それをgameState.quizzesに代入している。
  //     4. インデックス番号と正答数をリセットし、setNextQuiz関数を実行する
    try {
      const response = await fetch(API_URL);
      const data = await response.json(); //JSONを受取るために必要
      gameState.quizzes = data.results;
      gameState.currentIndex = 0;
      gameState.numberOfCorrects = 0;
      setNextQuiz();
    } catch (error) {
      alert(`読み込み失敗... (${error.message})`);
    }
  };

  // setNextQuiz()を実装
  //   機能：次のクイズを表示する
  //   実行されるタイミング：1.fetchQuizData関数の実行後
  //                     2.ユーザーが解答を選択した後（10問目でない場合）
  const setNextQuiz = () => {
    // はじめに問題文と解答を空にする
    questionElement.textContent = '';
    removeAllAnswers();

    //   残っている問題があるならmakeQuiz() を実行
    //   ないならfinishQuiz() を実行
    if (gameState.currentIndex < gameState.quizzes.length ) {
      const quiz = gameState.quizzes[gameState.currentIndex];
      makeQuiz(quiz);
    } else {
      finishQuiz();
    }
  };

  // 全ての問題が終わった時に使用する finishQuiz() を実装
  //   機能：正答数を表示する。Restartボタンを表示する。
  const finishQuiz = () => {
    resultElement.textContent = `${gameState.numberOfCorrects}/${gameState.quizzes.length} corrects.`;
    restartButton.hidden = false;
  };

  // removeAllAnswers関数 を実装
  //   ul 'answer' のli子要素（解答）を全て削除する
  const removeAllAnswers = () => {
    while (answersContainer.firstChild) {
      answersContainer.removeChild( answersContainer.firstChild );
    }
  };

  // makeQuiz関数を実装する
  //  機能：クイズデータを元にWebページ上に問題と解答リストを表示する
  //   　　解答をクリックしたら、正解・不正解のチェックをする
  //       - 正解の場合
  //         - 「gameState」オブジェクトで管理している正答数プロパティをインクリメントする
  //         - 「正解です!!」とアラート表示する
  //       - 不正解の場合
  //         - 「残念...不正解です... (正解は "APIで取得したAnswer")」とアラート表示する
  //   - 回答する度に「gameState」オブジェクトで管理している、問題数プロパティをインクリメントする
  //   - setNextQuiz関数を実行して次の問題をセットする(最後の問題の場合は結果を表示する。)

  const makeQuiz = (quiz) => {
    // シャッフル済みの解答一覧を取得する
    const answers = buildAnswers(quiz);

    // 問題文をあんエスケープして代入
    questionElement.textContent = unescapeHTML(quiz.question);

    // 解答をアンエスケープしてansewes配下にli要素をつけて解答をセット
    answers.forEach((answer) => {
      const liElement = document.createElement('li');
      liElement.textContent = unescapeHTML(answer);
      answersContainer.appendChild(liElement);

      // 解答を選択したときの処理
      liElement.addEventListener('click', (event) => {
        unescapedCorrectAnswer = unescapeHTML(quiz.correct_answer);
        if (event.target.textContent === unescapedCorrectAnswer) {
          gameState.numberOfCorrects++;
          alert('正解です!!');
        } else {
          alert(`残念...不正解です... (正解は "${unescapedCorrectAnswer}")`);
        }
        // インデックス番号をインクリメント
        gameState.currentIndex++;
        setNextQuiz();
      });
    });
  };

  // buildAnswers関数を実装
  // 機能：正解・不正解の解答をシャッフルする。
  // APIが渡すquizオブジェクトの中にあるcorrect_answer, incorrect_answersを結合する。
  // またAPIのresponse.jsonは[正解,不正解,不正解,不正解]の規則的な順番になっているためシャッフルする必要がある
  const buildAnswers = (quiz) => {
    const answers = [
      quiz.correct_answer,
      ...quiz.incorrect_answers　//3つの不正解をまとめて選択
    ];
    const shuffledAnswers = shuffle(answers);

    return shuffledAnswers;
  };

  // shuffle関数 を実装
  //   機能：引数で受け取った配列内の値をシャッフルする
  //   　　　引数で渡された配列を上書きしないように、シャッフルする配列はコピーしたものを使う
  //   引数→array : 配列
  //   戻り値→shffuledArray : シャッフル後の配列(コピーしてシャッフルしているため、引数の配列とは別の配列)
  const shuffle = (array) => {
    const copiedArray = array.slice(); //sliceを使って配列をコピーする
    for (let i = copiedArray.length - 1; i >= 0; i--){
      const rand = Math.floor( Math.random() * ( i + 1 ) );
      [copiedArray[i], copiedArray[rand]] = [copiedArray[rand], copiedArray[i]]
    }
    return copiedArray;
  };


  // unescapeHTML関数を実装する
  //    機能：エスケープ文字を元に戻す
  //     参考サイト: http://blog.tojiru.net/article/211339637.html

  const unescapeHTML = (str) => {
    var div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
                       .replace(/>/g,"&gt;")
                       .replace(/ /g, "&nbsp;")
                       .replace(/\r/g, "&#13;")
                       .replace(/\n/g, "&#10;");

    return div.textContent || div.innerText;
  };
})();