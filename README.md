・説明  
fetch('API')を使った4択クイズです。

・処理フロー  
１.fetchQuizData関数 新しいクイズデータの取得  
↓  
２.setNextQuiz関数 次のクイズを表示する  
↓  
３.removeAllAnswers関数 前回のmakeQuiz関数によって代入されたanswers をリセットする  
↓  
４.makeQuiz関数 問題と解答を表示する  
↓  
5.buildAnswers関数 response.json内の正解と不正解を配列にしshuffle関数を実行する
↓  
6.Shuffle関数 引数で受け取った配列をシャッフルする  
↓  
7.unescape関数 アンエスケープ処理を実装する  
↓  
8.finishQuiz関数 正答数とリスタートボタンを表示する  
