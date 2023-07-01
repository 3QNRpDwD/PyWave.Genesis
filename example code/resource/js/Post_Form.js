    // 댓글 작성 폼 제출 시 처리
    document.getElementById("comment-form").addEventListener("submit", function(event) {
        event.preventDefault();
  
        var username = document.getElementById("comment-username").value;
        var content = document.getElementById("comment-content").value;
        // var image = document.getElementById("comment-image").files[0];
  
        // FormData 객체를 사용하여 댓글 데이터를 구성
        var formData = {
        "Form": "Comment",
        "username": username,
        "content": content,
        // "image": image,
        }
        console.log(JSON.stringify(formData));
        // 서버로 데이터를 전송하는 fetch 요청
        fetch("/Comment", {
          method: "POST",    
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })
        .then(function(response) {
          if (response.ok) {
            // 서버로부터 응답을 받은 후, 댓글 목록을 업데이트하는 함수 호출
            updateComments();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
  
        // 댓글 작성 폼 초기화
        document.getElementById("comment-username").value = "";
        document.getElementById("comment-content").value = "";
        // document.getElementById("comment-image").value = null;
      });
  
      // 댓글 목록을 업데이트하는 함수
      function updateComments() {
        fetch("/comments")
          .then(function(response) {
            if (response.ok || response.status === 422 || response.status === 403 || response.status === 400) {
              return response.json();
            }
          })
          .then(responseHTML => {
            var newPage = document.open("text/html", "replace");
            newPage.write(responseHTML);
            newPage.close();
            resolve(responseHTML);
          })
          // .then(function(comments) {
          //   var commentsContainer = document.querySelector(".comments");
          //   console.log(commentsContainer);
          //   commentsContainer.innerHTML = "";
  
          //   comments.forEach(function(comment) {
          //     var commentElement = document.createElement("div");
          //     commentElement.classList.add("comment");
  
          //     var usernameElement = document.createElement("span");
          //     usernameElement.classList.add("comment-username");
          //     usernameElement.textContent = comment.username;
  
          //     var contentElement = document.createElement("div");
          //     contentElement.classList.add("comment-content");
          //     contentElement.textContent = comment.content;
  
          //     commentElement.appendChild(usernameElement);
          //     commentElement.appendChild(contentElement);
          //     commentsContainer.appendChild(commentElement);
          //   });
          // })
          .catch(function(error) {
            console.log(error);
          });
      }
  
      // 페이지 로드 시 댓글 목록을 업데이트하는 함수 호출
      updateComments();