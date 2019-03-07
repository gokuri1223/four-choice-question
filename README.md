・説明  
fetch('API')を使った4択クイズです。

・処理フロー  
１.fetchQuizData関数 新しいクイズデータの取得  
↓  
２.setNextQuiz関数 次のクイズを表示する  
↓  
３.removeAllAnswers関数 前回のmakeQuiz関数によって代入されたanswers をリセットする  
↓  
４.makeQuiz関数 
↓　　↓  
↓　5.buildAnswers関数
↓　　↓  
↓　6.Shuffle関数
↓　　↓  
↓　7.unescape関数
↓　　↓  
8.finishQuiz関数  

APIから渡されるresponse.json内の解答をシャッフルする処理
