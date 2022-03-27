const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



const SETTING_STORAGE = 'CAI DAT APP'




const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const currentimeSecond = $('.currentimeSecond')
const durationTime = $('.durationTime')
const prevBtn = $('.btn-prev')
const netxBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const volume = $('.volume')
const muteVolume = $('.volume-0')




// render songs ==> OK
// play / pause / seek ==> OK
// cd rotate === > OK animate 
// next , prev song ==> 0k
// random song ==> OK random
// repeat song ===> OK repeat
// active Song ==> 0k
// scroll Active song into view ==> OK
// active song ==> OK active


// danh sách các bài hát
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isOption: false,
    isMute: false,
    Config: JSON.parse(localStorage.getItem(SETTING_STORAGE)) || {},
    setConfig: function(key, value) {
        this.Config[key] = value
        localStorage.setItem(SETTING_STORAGE, JSON.stringify(this.Config))
    },
    songs: [{
            name: 'phiêu',
            singer: 'Vladimir Vladimirovich Putin',
            path: './assets/sing/englishmusic.mp3',
            img: './assets/img/song_6.jfif'
        },

        {
            name: 'Nhạc Lofi 2022  Những Bản Lofi Mix Chill...',
            singer: 'Trường Sơn',
            path: './assets/sing/lofi.mp3',
            img: './assets/img/0 (1).jpg'
        },

        {
            name: 'EDM Tik Tok  Top 12 Bản Nhạc Tik Tok...',
            singer: 'Trường Sơn',
            path: './assets/sing/EDM1.mp3',
            img: './assets/img/0 (2).jpg'
        },

        {
            name: 'Già Cùng Nhau Là Được  TeA ft PC  Prod ',
            singer: 'Trường Sơn',
            path: './assets/sing/gia.mp3',
            img: './assets/img/0.jpg'
        },

        {
            name: 'EDM TikTok Hay 2022  BXH Nhạc Trẻ Remix Hay...',
            singer: 'Trường Sơn',
            path: './assets/sing/EDM2.mp3',
            img: './assets/img/0 (3).jpg'
        },

        {
            name: 'Urra - Vladimir Vladimirovich Putin',
            singer: 'Vladimir Vladimirovich Putin',
            path: './assets/sing/Urra.mp3',
            img: './assets/img/song_1.jfif'
        }, {
            name: 'Đau Đớn Nhất là im lặng',
            singer: 'ERIK',
            path: './assets/sing/daunhatlalangim.mp3',
            img: './assets/img/song_4.jfif'
        }, {
            name: 'Ngày Đầu Tiên',
            singer: 'Đức Phúc',
            path: './assets/sing/ngaydautien.mp3',
            img: './assets/img/song_3.jfif'
        }, {
            name: 'Xin Đừng Lặng Im',
            singer: 'Subin Trường Sơn',
            path: './assets/sing/xindunglangim.mp3',
            img: './assets/img/song_5.jfif'
        }, {
            name: 'Đừng yêu em nữa em mệt rồi',
            singer: 'min',
            path: './assets/sing/dungyeunua.mp3',
            img: './assets/img/song_2.jfif'
        }, {
            name: 'Nắm - Hương Ly',
            singer: 'hương ly',
            path: './assets/sing/nam.mp3',
            img: './assets/img/song_8.jfif'
        }, {
            name: 'let me down slowly',
            singer: 'Trường Sơn',
            path: './assets/sing/donmysoly.mp3',
            img: './assets/img/song_9.jfif'
        }, {
            name: 'IDM _ Phiêu Lắm Ý ',
            singer: 'Trường Sơn CSS',
            path: './assets/sing/new.mp3',
            img: './assets/img/song_10.jfif'
        }


    ],
    render: function() {
        const html = this.songs.map((song, index) => {
            return `
            
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index =${index}>
                <div class="thumb" style="background-image: url('${song.img}')"></div>
                
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                   
                </div>
            </div>

            `
        })
        playlist.innerHTML = html.join('');

    },
    // định nghĩa ra một phương thức

    definedProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    // xư lí các sự kiện ở trong dom
    handeleEvent: function() {
        const _this = this;

        // xử lí việc CD rotate quay
        const cdThumbRotate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 6000, // 10 seconds
            iterations: Infinity
        })
        cdThumbRotate.pause()

        // xử lí co nhỏ kích thước của cd
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.screenY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lí khi play bài hát

        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

        }

        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbRotate.play()
        }

        audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbRotate.pause()
            }
            //xử lí khia tua bài hát

        audio.ontimeupdate = function() {
            /*   const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
              console.log(progressPercent)

              if (audio.duration) {
                  progress.value = progressPercent
                  console.log(progress.value)

              } */

            const durationMinute = Math.floor(audio.duration)
            currentimeSecond.innerText = app.formatTime(audio.currentTime)
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);

            if (audio.duration) {
                progress.value = progressPercent
            }

        }
        progress.onchange = function(e) {
            audio.currentTime = (audio.duration / 100) * e.target.value
        }

        // cử lí khi prev bài hát
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSongs()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.activeSongIntoView()
        }


        // cử lí khi next bài hát
        netxBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSongs()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.activeSongIntoView()
        }

        // Xử lí khi bật tắt cái random Song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }


        // Xử lí khi bật tắt repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat)
        }

        // xử lí khi hết bài hát
        audio.onended = function() {
            if (_this.isRepeat) {
                setTimeout(() => {
                    audio.play()
                }, 500)
            } else {
                setTimeout(() => {
                    _this.render()
                        // _this.loadCurrentSong()
                    _this.endedSongs()
                }, 500)

            }
        }


        // xử lí khi active song click
        playlist.onclick = function(e) {
                const songNode = e.target.closest('.song:not(.active)')

                if (songNode || e.target.closest('.option')) {
                    // xử lí khi active song click

                    if (songNode) {
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        audio.play()

                    }
                    if (e.target.closest('.option')) {
                        const songOptions = playlist.querySelectorAll('.song .option')


                        Array.from(songOptions).map(songOption => {


                            songOption.onclick = function() {


                                songOption.innerHTML = `
                                    <i class="fas fa-ellipsis-h"></i>
                                    <ul class="option-list">
                                        <li class="options-item options-item-load">
                                            Tải lại trang</li>
                                        <li class="options-item">
                                            <a href="https://www.facebook.com/profle.php.id.3107.100035504550108/" class="option-link">
                                                <i class="options-icon fa-brands fa-facebook"></i> Facebook
                                            </a>
                                        </li>
                                        <li class="options-item">
                                            <a href="https://www.instagram.com/truongson0911/" class="option-link">
                                                <i class="options-icon fa-brands fa-instagram"></i> Intagram
                                            </a>
                                        </li>
                                    </ul>
        
                                `
                            }




                        })





                    }
                }
            }
            //xư lí khi người dùng điều chinh âm lượng
        audio.volume = 0.4
        volume.onchange = function(e) {
            audio.volume = volume.value / 100
            muteVolume.classList.remove('active')
        }

        muteVolume.onclick = function(e) {
            _this.isMute = !_this.isMute
            if (_this.isMute) {
                audio.volume = 0
                muteVolume.classList.toggle('active', _this.isMute)
            } else {
                audio.volume = volume.value / 100
                muteVolume.classList.remove('active')
            }
        }


    },
    // Xử lí đưa bài hát vào dom (tầm nhìn của người dung)
    activeSongIntoView: function() {
        setTimeout(function() {
            if (this.currentIndex > 2) {
                $('.song.active').scrollIntoView({
                    behavior: "smooth",
                    block: 'nearest'
                }, 500)
            } else {
                $('.song.active').scrollIntoView({
                    behavior: "smooth",
                    block: 'center'
                }, 500)
            }
        })

    },
    // định dạng lại thời gian phút giây
    formatTime: function(number) {
        const minutes = Math.floor(number / 60);
        const seconds = Math.floor(number - minutes * 60);
        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    },


    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
        setTimeout(function() {
            if (audio.duration) {
                durationTime.innerText = app.formatTime(audio.duration)
            }
        }, 100)

    },
    //load config
    loadConfig: function() {
        this.isRandom = this.Config.isRandom
        this.isRepeat = this.Config.isRepeat

        // Object assign cũng có thể dùng đucowj
    },

    // xử lí khi next bài hát
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.activeSongIntoView()
    },

    // xử lí khi lùi bài hát
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = app.songs.length - 1
        }
        this.loadCurrentSong()
    },
    // ham xử lí khi random song
    randomSongs: function() {

        let newIndex
        do {
            newIndex = Math.floor(Math.random() * app.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    //Xưr lí khi chạy hết hát
    endedSongs: function() {
        if (this.isRandom) {
            this.randomSongs()
        } else {
            this.nextSong()
        }
        // this.loadCurrentSong()
        this.render()

        audio.play()
    },

    // Khởi chạy ứng dụng
    start: function() {

        // gan cấu hình tuè cònig vào ứng dụng
        this.loadConfig();


        // xử lí các sự kiện trong app

        this.render();


        this.handeleEvent();

        // render ra danh sách (list) bài hát


        // định nghĩa ra cái thuộc tính

        this.definedProperties()
            // Load bài hát đầu tiên khi mở app

        this.loadCurrentSong();

        // hieẻn thị trạng thái ban đầu của random và repeat
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    }
}

app.start();