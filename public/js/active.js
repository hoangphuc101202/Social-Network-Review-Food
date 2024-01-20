

(function ($) {
    'use strict';

    var browserWindow = $(window);
    var treadingPost = $('.treading-post-area');

    // :: 1.0 Preloader Active Code
    browserWindow.on('load', function () {
        $('.preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });

    // :: 2.0 Nav Active Code
    if ($.fn.classyNav) {
        $('#buenoNav').classyNav();
    }

    // :: 3.0 Sticky Active Code
    if ($.fn.sticky) {
        $("#sticker").sticky({
            topSpacing: 0
        });
    }

    // :: 4.0 niceSelect Active Code
    if ($.fn.niceSelect) {
        $("select").niceSelect();
    }

    // :: 5.0 Video Active Code
    if ($.fn.magnificPopup) {
        $('.img-zoom').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    }

    // :: 6.0 Sliders Active Code
    if ($.fn.owlCarousel) {

        var welcomeSlide = $('.hero-post-slides');
        var videoSlides = $('.video-slides');
        var albumSlides = $('.albums-slideshow');

        welcomeSlide.owlCarousel({
            items: 3,
            margin: 30,
            loop: true,
            nav: true,
            navText: ['Prev', 'Next'],
            dots: false,
            autoplay: true,
            center: true,
            autoplayTimeout: 7000,
            smartSpeed: 1000,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });

        welcomeSlide.on('translate.owl.carousel', function () {
            var slideLayer = $("[data-animation]");
            slideLayer.each(function () {
                var anim_name = $(this).data('animation');
                $(this).removeClass('animated ' + anim_name).css('opacity', '0');
            });
        });

        welcomeSlide.on('translated.owl.carousel', function () {
            var slideLayer = welcomeSlide.find('.owl-item.active').find("[data-animation]");
            slideLayer.each(function () {
                var anim_name = $(this).data('animation');
                $(this).addClass('animated ' + anim_name).css('opacity', '1');
            });
        });

        $("[data-delay]").each(function () {
            var anim_del = $(this).data('delay');
            $(this).css('animation-delay', anim_del);
        });

        $("[data-duration]").each(function () {
            var anim_dur = $(this).data('duration');
            $(this).css('animation-duration', anim_dur);
        });
    }

    // :: 7.0 ScrollUp Active Code
    if ($.fn.scrollUp) {
        browserWindow.scrollUp({
            scrollSpeed: 1500,
            scrollText: '<i class="fa fa-angle-up"></i>'
        });
    }

    // :: 8.0 Tooltip Active Code
    if ($.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip()
    }

    // :: 9.0 Prevent Default a Click
    $('a[href="#"]').on('click', function ($) {
        $.preventDefault();
    });

    // :: 10.0 Wow Active Code
    if (browserWindow.width() > 767) {
        new WOW().init();
    }

    // :: 11.0 niceScroll Active Code
    if ($.fn.niceScroll) {
        $("#treadingPost").niceScroll();
    }

    // :: 12.0 Toggler Active Code
    $('#toggler').on('click', function () {
        treadingPost.toggleClass('on');
    });
    $('.close-icon').on('click', function () {
        treadingPost.removeClass('on');
    });

})(jQuery);
$(document).ready(function() {
	
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
   
    $(".file-upload").on('change', function(){
        readURL(this);
    });
    
    $(".upload-button").on('click', function() {
       $(".file-upload").click();
    });
});
let fileInput = document.getElementById("file-input");
let imageContainer = document.getElementById("images");
let numOfFiles = document.getElementById("num-of-files");
let removeButton = document.getElementById("btn-remove");

function preview() {
    imageContainer.innerHTML = "";
    numOfFiles.textContent = `${fileInput.files.length} Files Selected`;

    for (let i = 0; i < fileInput.files.length; i++) {
        let reader = new FileReader();
        let figure = document.createElement("figure");
        let figCap = document.createElement("figcaption");
        figCap.innerText = fileInput.files[i].name;

        figure.appendChild(figCap);

        reader.onload = () => {
            let img = document.createElement("img");
            img.setAttribute("src", reader.result);
            figure.insertBefore(img, figCap);
        };

        imageContainer.appendChild(figure);
        reader.readAsDataURL(fileInput.files[i]);
    }

    if (fileInput.files.length > 0) {
        removeButton.style.display = "block";
    } else {
        removeButton.style.display = "none";
    }
}

function removeImage() {
    fileInput.value = null;
    preview();
}

    function removeImageValueEdit(postId) {
        // Sử dụng querySelector để chọn các phần tử trong phạm vi của bài post cụ thể (postId)
        const postImages = document.querySelectorAll(`#EditPostModal_${postId} .preview-image`);
        const valueImageInput = document.getElementById(`inputImagePrevious_${postId}`);
        const btnRemoveEditValue = document.getElementById(`btn-remove-edit-value_${postId}`); 
        postImages.forEach(image => {
            image.style.display = 'none';
            image.remove(); // Ẩn các hình ảnh trong bài post cụ thể
        });

        if (valueImageInput) {
            valueImageInput.value = ''
            console.log('ro')
            console.log(valueImageInput.value) // Đặt giá trị của input thành rỗng
        }  
        const fileInput = $(`#file-input-edit_${postId}`);
        if (fileInput.length > 0) {
        fileInput.val(''); // Đặt lại giá trị của input file bằng cách sử dụng jQuery
        }

        if (btnRemoveEditValue) {
            btnRemoveEditValue.style.display = 'none';
            console.log("ẩn")// Ẩn nút "Remove previous image" trong bài post cụ thể
        }
    }

function previewEdit(postId) {
    let imageContainerEdit = document.getElementById(`imagesEdit_${postId}`);
    let fileInputEdit = document.getElementById(`file-input-edit_${postId}`);
    let removeButtonEdit = document.getElementById(`btn-remove-edit_${postId}`);

    if (fileInputEdit.files && fileInputEdit.files.length > 0) {
        // Xóa hình ảnh trước đó nếu có
        let previousImages = document.querySelectorAll(`#EditPostModal_${postId} .preview-image`);
        previousImages.forEach(image => {
            image.remove();
        });

        // Hiển thị hình ảnh mới được chọn
        for (let i = 0; i < fileInputEdit.files.length; i++) {
            let reader = new FileReader();
            let figure = document.createElement("figure");
            let figCap = document.createElement("figcaption");
            figCap.innerText = fileInputEdit.files[i].name;

            figure.appendChild(figCap);

            reader.onload = () => {
                let img = document.createElement("img");
                img.setAttribute("src", reader.result);
                img.classList.add("preview-image"); // Thêm class cho hình ảnh để xác định
                figure.insertBefore(img, figCap);
            };

            imageContainerEdit.appendChild(figure);
            reader.readAsDataURL(fileInputEdit.files[i]);
        }

        removeButtonEdit.style.display = "block";
    } else {
        removeButtonEdit.style.display = "none";
    }
}

// Các sự kiện trong input
document.addEventListener('DOMContentLoaded', () => {
    let fileInputs = document.querySelectorAll("[id^='file-input-edit']");

    fileInputs.forEach((fileInput) => {
        fileInput.addEventListener('change', function() {
            const postId = this.id.split('_')[2]; // Lấy postId từ ID của input
            const selectedFiles = this.files;
            if (selectedFiles.length > 0) {
                console.log(`Đã chọn ${selectedFiles.length} tệp`);
                previewEdit(postId);
                // Thực hiện xử lý tệp tin ở đây nếu cần
            } else {
                console.log('Không có tệp nào được chọn');
            }
        });
    });
});
function validatePicture(event) {
    const fileInputEdit = document.getElementById(`file-input`);
    if(!fileInputEdit.files || fileInputEdit.files.length === 0){
        event.preventDefault(); // Chặn sự kiện mặc định
        const imageRequiredModal = new bootstrap.Modal(document.getElementById('imageRequiredModal'));
        imageRequiredModal.show();
    }
}
// Biến cờ để kiểm tra xem có ảnh được chọn hay không
// Function to validate and submit the form
function validateAndSubmit(postId, event) {
    const fileInputEdit = document.getElementById(`file-input-edit_${postId}`);
    const valueImageInput = document.getElementById(`inputImagePrevious_${postId}`);

    // Check if there are no files selected and no previous image value
    if ((!fileInputEdit.files || fileInputEdit.files.length === 0) && (!valueImageInput || valueImageInput.value === '' || valueImageInput.value === null)) {
        event.preventDefault(); // Chặn sự kiện mặc định
        const imageRequiredModal = new bootstrap.Modal(document.getElementById('imageRequiredModal'));
        imageRequiredModal.show(); // Hiển thị modal
    }
}
document.addEventListener("DOMContentLoaded", function() {
    const posts = document.querySelectorAll('.card-text');

    posts.forEach(post => {
        const postId = post.id.split('_')[1]; // Lấy ID của bài post
        const readMoreBtn = document.getElementById(`readMore_${postId}`);

        if (post.textContent.length > 100) {
            if (readMoreBtn) {
                readMoreBtn.style.display = 'inline'; // Hiển thị nút "Read more"
            }
            
            const content = post.textContent.substring(0, 100);
            post.textContent = content + '...'; // Cắt nội dung và thêm dấu "..." cho nội dung thu gọn
            return;
        } 
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const blogPosts = document.querySelectorAll('.blog-content-home');

    blogPosts.forEach(post => {
        const content = post.querySelector('p');
        if (content.textContent.length > 100) {
            const shortenedContent = content.textContent.substring(0, 100);
            content.textContent = shortenedContent + '...'; // Cắt nội dung và thêm dấu "..." cho nội dung thu gọn

        }
    });
});

// document.addEventListener('DOMContentLoaded', () => {
//     const followButton = document.getElementById('followBtn');
//     let isFollowing = followButton.classList.contains('btn-Unfollow');

//     followButton.addEventListener('click', async (event) => {
//         event.preventDefault();

//         if (!isFollowing) {
//             const userId = followButton.getAttribute('data-user-id');
//             const response = await followerUser(userId);

//             if (response && response.ok) {
//                 followButton.classList.remove('btn-follow');
//                 followButton.classList.add('btn-Unfollow');
//                 followButton.textContent = 'Following';
//                 isFollowing = true; // Cập nhật g   iá trị isFollowing
//             } else {
//                 console.error('Error:', response.error);
//             }
//         }
//     });
// });
document.addEventListener('DOMContentLoaded', () => {
    const followButton = document.getElementById('followBtn');
    if (followButton) {
        followButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const userId = followButton.getAttribute('data-user-id');
            const isFollowing = followButton.classList.contains('btn-Unfollow');
            
            try {
                if (!isFollowing) {
                    const response = await followerUser(userId);
                    
                    if (response && response.ok) {
                        followButton.classList.remove('btn-follow');
                        followButton.classList.add('btn-Unfollow');
                        followButton.textContent = 'Following';
                    } else {
                        console.error('Error:', response.error);
                    }
                } else {
                    const response = await deleteFollower(userId);
                    
                    if (response && response.ok) {
                        followButton.classList.remove('btn-Unfollow');
                        followButton.classList.add('btn-follow');
                        followButton.textContent = 'Follow';
                    } else {
                        console.error('Error:', response.error);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});

async function deleteFollower(idUsers){
    try{
        const response = await fetch(`/users/deletefollow/${idUsers}`, {
            method: 'DELETE'
        });
        return response;
    }
    catch (error) {
        console.error('Error:', error);
        return { error: error };
    }
}

async function followerUser(idUsers) {
    try {
        const response = await fetch(`/users/follow/${idUsers}`, {
            method: 'POST'
        });
        if (response.status === 401) {
            window.location.href = '/auth/login'; // Chuyển hướng đến trang đăng nhập khi cần thiết
        }
        return response;
    } catch (error) {
        console.error('Error:', error);
        return { error: error };
    }
}

$(document).ready(function() {
    $('.navbar-nav .nav-link').on('click', function() {
      $('.navbar-nav').find('.active').removeClass('active');
      $(this).addClass('active');
    });
  });
  const socket = io();
 socket.on('new-comment-added', (newComment) => {
    const commentList = document.querySelector('.comment_area ol');
    const postElement = document.getElementById('post-blog');
    const postId = postElement.getAttribute('data-id'); 
    if(newComment.idPost === postId){
        // Tạo một phần tử li mới
        const newCommentElement = document.createElement('li');
        newCommentElement.classList.add('single_comment_area');
        newComment.date = new Date(newComment.date);
        // Tạo HTML cho comment mới
        newCommentElement.innerHTML = `
            <div class="comment-content d-flex">
                <div class="comment-author">
                    <img style="border-radius: 50%; object-fit: cover;width: 50px; height: 50px;" src="${newComment.authorImage}" alt="author">
                </div>
                <div class="comment-meta">
                    <div class="d-flex">
                        <a href="#" class="post-author">${newComment.author}</a>
                        <a href="#" class="post-date">${newComment.date.toDateString()}</a>
                        <a href="#" class="reply">Reply</a>
                    </div>
                    <p>${newComment.comment}</p>
                </div>
            </div>
        `;
    
        // Thêm comment mới vào danh sách comment
        commentList.appendChild(newCommentElement);
    }    
});

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.getElementById('passwordForm').addEventListener('submit', function(event) {
    var newPassword = document.getElementById('NewPassword').value;
    var confirmPassword = document.getElementById('ConfirmPassword').value;
    var passwordError = document.getElementById('passwordError');

    if (newPassword !== confirmPassword) {
        passwordError.style.display = 'block';
        event.preventDefault(); // Ngăn form gửi đi nếu mật khẩu không khớp
    } else {
        passwordError.style.display = 'none';
        // Nếu mật khẩu khớp, tiếp tục gửi form
    }
});




