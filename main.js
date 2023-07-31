//model
function Model(){
    let myView = null;
    let num = 1;
    let k = 0;
    let load = true;
    let shouldLoad = true; //закончился ли новый контент
    let pagination = false; //включена ли пагинация
    let postData = null;

    this.init = function(view){
        myView = view;

        if(load === true){
            myView.createLoader();
            this.loaderAnim();
        }
    }

    this.loaderAnim = () => {
        k += 2;

        myView.loaderAnim(k);
        requestAnimationFrame(this.loaderAnim);
    }

    this.clearLoader = function(){
        load = false;
        myView.clearLoader();
    }

    this.getData = async function(){
        const resp = await fetch(`https://rickandmortyapi.com/api/character?page=${num}`);
        const data = await resp.json();
        return data;
    }

    this.createCards = async () => {
        postData = await this.getData();

        for(let i = 0; i <= postData.results.length - 1; i++){
            myView.createCards(postData.results, i);
        }
        shouldLoad = false;
    }

    this.showModal = function(target){
        myView.showModal();
        fetch(target.dataset.url)
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            myView.getPersLinks();
            myView.showPersInfo(data);
        });
    }

    this.closeModal = function(){
        myView.closeModal();
    }

    this.checkPosition = () => {
        shouldLoad = true;
        const height = window.innerHeight;
        const screenHeight = document.documentElement.scrollHeight;

        const scrolled = window.scrollY;

        const threshold = screenHeight - height / 9;

        const position = scrolled + height;

        if (!pagination && shouldLoad && num !== 42 && position >= threshold ) {
            num++;
            this.createCards();
        }
    }

    this.createPagination = function(){
        pagination = true;
        myView.createPagination(num);
    }

    this.changePage = async (page) => {
        myView.clearPage();
        // console.log(page);
        num = Number(page);

        this.createCards();
    }

    this.previousPage = function(){
        if(num <= 1) return;
        myView.clearPagination();
        num--;
        myView.createPagination(num);
    }

    this.nextPage = function(){
        if(num >= 37) return;
        myView.clearPagination();
        num++;
        myView.createPagination(num);
    }
}
//end model

//view
function View(){
    const modal = document.getElementById('modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const body = document.querySelector('body');
    const main = document.querySelector('.main');
    let svgElem = null;;
    let loader = null;
    let persImg = null;
    let persName = null;
    let persStatus = null;
    let persSpecies = null;
    let persOrigin = null;
    let persLocation = null;
    let persGender = null;
    let paginationContent = null;

    this.createLoader = function(){
        loader = document.createElement('div');
        loader.classList.add('loader');
    
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS,"svg");
        svg.setAttributeNS(null, "viewBox", '0 0 25 25');
        svg.setAttributeNS(null, "width", '10%');
        svg.setAttributeNS(null, "height", '10%');
        svg.classList.add('svg');
        svg.innerHTML = '<path d="M12.432 8.42a2.203 2.203 0 0 1-2.196-2.21c0-1.22.983-2.21 2.196-2.21s2.196.99 2.196 2.21a2.208 2.208 0 0 1-2.196 2.21zm-4.677 1.756a2.014 2.014 0 0 1-2.007-2.02c0-1.116.899-2.02 2.007-2.02 1.109 0 2.007.904 2.007 2.02a2.017 2.017 0 0 1-2.007 2.02zm-1.984 4.569a1.77 1.77 0 0 1-1.636-1.1 1.79 1.79 0 0 1 .384-1.944 1.763 1.763 0 0 1 1.93-.385 1.783 1.783 0 0 1 1.093 1.648 1.78 1.78 0 0 1-1.771 1.78zm1.985 4.523c-.83 0-1.501-.676-1.501-1.51 0-.835.672-1.51 1.5-1.51.83 0 1.501.675 1.501 1.51a1.509 1.509 0 0 1-1.5 1.51zm4.676 1.729c-.723 0-1.31-.59-1.31-1.318 0-.728.587-1.317 1.31-1.317.723 0 1.309.59 1.309 1.317 0 .728-.586 1.318-1.31 1.318zm4.745-2.227a1.062 1.062 0 0 1-1.058-1.066c0-.588.474-1.065 1.058-1.065a1.065 1.065 0 0 1 0 2.131zm1.943-4.926a.871.871 0 0 1-.868-.874c0-.483.389-.874.868-.874a.876.876 0 0 1 .614 1.492.865.865 0 0 1-.614.256zM16.502 8.22a.675.675 0 0 1 1.3-.263c.123.3.02.645-.249.826a.675.675 0 0 1-1.052-.563z" fill="#fff"/>';
        body.append(loader);
        loader.append(svg);

        svgElem = document.querySelector('.svg');
    }

    this.loaderAnim = (k) => {
        svgElem.setAttributeNS(null, "transform", `rotate(${k})`);
    }

    this.clearLoader = function(){
        loader.style.display = 'none';
    }

    this.createCards = function (data, i){
        const main = document.querySelector('.main');

        const card = document.createElement('div');
        card.classList.add('section');
        card.dataset.url = `https://rickandmortyapi.com/api/character/${data[i].id}`;
    
        const img = document.createElement('img');
        img.src = data[i].image;
        img.classList.add('pers__img');
    
        const name = document.createElement('h2');
        name.classList.add('pers__name');
        name.textContent = data[i].name;
    
        card.append(img, name);
        main.append(card);
    }

    this.showModal = function(){
        modal.classList.remove('modal_closed');
        modalOverlay.classList.remove('modal_closed');
        body.classList.add('hide');
    }

    this.closeModal = function(){
        modal.classList.add('modal_closed');
        modalOverlay.classList.add('modal_closed');
        body.classList.remove('hide');

        persImg.setAttribute('src', '');

        persName.textContent = '';
        persStatus.textContent = '';
        persSpecies.textContent = '';
        persOrigin.textContent = '';
        persLocation.textContent = '';
        persGender.textContent = '';
    }

    this.getPersLinks = function(){
        persImg = document.querySelector('.pers__img_elem');
        persName = document.querySelector('.pers__name_modal');
        persStatus = document.querySelector('.pers__status');
        persSpecies = document.querySelector('.pers__species');
        persOrigin = document.querySelector('.pers__origin');
        persLocation = document.querySelector('.pers__location');
        persGender = document.querySelector('.pers__gender');
    }
    
    this.showPersInfo = function(data){
        persImg.setAttribute('src', data.image);

        persName.textContent = data.name;
        persStatus.textContent = data.status;
        persSpecies.textContent = data.species;
        persOrigin.textContent = data.origin.name;
        persLocation.textContent = data.location.name;
        persGender.textContent = data.gender;
    }

    this.createPagination = function(k){
        // console.log(k);
        const pagination = document.querySelector('.pagination');
        pagination.style.display = 'flex';

        paginationContent = document.getElementById('pagination__content');

        for(let i = k; i <= k + 5; i++){ //42
            const page = document.createElement('a');
            page.textContent = i;
            page.dataset.url = `https://rickandmortyapi.com/api/character?page=${i}`;
            page.classList.add('pagination__content_page');
            paginationContent.append(page);
        }
    }

    this.clearPage = function(){
        main.innerHTML = '';
    }

    this.clearPagination = function(){
        paginationContent.innerHTML = '';
        paginationContent = null;
    }
}
//end view

//controller
function Controller(){
    let myModel = null;
    let myContainer = null;
    const modal = document.getElementById('modal');
    const toTop = document.querySelector('.to_top');
    const paginationBtn = document.querySelector('.header__btn');
    let arrowLeft = null;
    let arrowRight = null;
    let paginPages = null;

    this.init = function(model, container){
        myModel = model;
        myContainer = container;

        window.addEventListener('load', function (){
            setTimeout(() => {
                myModel.clearLoader();
                myModel.createCards();
                paginationBtn.style.display = 'block';
            }, 1000);
        });

        myContainer.addEventListener('click', function (e){
            e.preventDefault();
            if(e.target.closest('div')){
                myModel.showModal(e.target.closest('div'));
                modal.addEventListener('click', function (e){
                    e.preventDefault();
                    if(e.target.className === 'modal__close'){
                        myModel.closeModal();
                    }
                });
            }
        });

        window.addEventListener('scroll', myModel.checkPosition);
        window.addEventListener('resize', myModel.checkPosition);

        window.addEventListener('scroll', function (){
            if(window.scrollY > 50){
                toTop.style.display = 'block';
            }
        });

        toTop.addEventListener('click', function (e){
            e.preventDefault();
            window.scrollTo(0,0);
        });

        paginationBtn.addEventListener('click', function createPagination (e){
            e.preventDefault();
            myModel.createPagination();
            arrowLeft = document.querySelector('.pagination__left');
            arrowRight = document.querySelector('.pagination__right');

            paginPages = document.querySelectorAll('.pagination__content_page');

            for(let page of paginPages){
                page.addEventListener('click', function (){
                    e.preventDefault();
                    myModel.changePage(page.textContent);
                });
            }

            arrowLeft.addEventListener('click', function (e){
                e.preventDefault();
                myModel.previousPage();

                paginPages = null;
                paginPages = document.querySelectorAll('.pagination__content_page');

                for(let page of paginPages){
                    page.addEventListener('click', function (){
                        e.preventDefault();
                        myModel.changePage(page.textContent);
                    });
                }
            });

            arrowRight.addEventListener('click', function (e){
                e.preventDefault();
                myModel.nextPage();

                paginPages = null;
                paginPages = document.querySelectorAll('.pagination__content_page');

                for(let page of paginPages){
                    page.addEventListener('click', function (){
                        e.preventDefault();
                        myModel.changePage(page.textContent);
                    });
                }
            });

            this.removeEventListener('click', createPagination);
        });
    }
}
//end controller

const ModelMain = new Model();
const ViewMain = new View();
const ControllerMain = new Controller();

const container = document.querySelector('.main');

ModelMain.init(ViewMain);
ControllerMain.init(ModelMain, container);