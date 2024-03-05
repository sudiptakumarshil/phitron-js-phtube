const getCategories = async () => {
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/videos/categories');
        if (!response.ok) throw new Error('Network Problem is detected!');
        const data = await response.json();
        displayCategories(data.data);
        return data;
    } catch (error) {
        throw error;
    }
}

const displayCategories = (data) => {
    const categories = document.getElementById('categories');
    let html = "";
    data.forEach(element => {
        html += `<button type="button" onclick='getContent(${element.category_id})' class="buttons btn btn-light btn-sm" id="btn${element.category_id}">${element.category}</button>`;
    });
    categories.innerHTML = html;
}

const getContent = async (id) => {
    clickedButton(id);
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`);
        if (!response.ok) throw new Error('Network Problem is detected!');
        const data = await response.json();
        displayContents(data.data)
        return data;
    } catch (error) {
        throw error;
    }
}

const displayContents = (data) => {
    const contents = document.getElementById('contents');

    let html = "";
    if (data.length == 0) {
        html += `
            <div class="d-flex justify-content-center">
                <img src="./Icon.png" />
            </div>
            <div class="d-flex justify-content-center mt-3">
                <h5>
                    <b>Opps!! Sorry,There is no conent here</b>
                </h5>
            </div>
        `;
        contents.innerHTML = html;
        return;
    }
    data.forEach(element => {
        html += `
            <div class="col-lg-3 col-md-3 col-12">
                <div class='container'>
                    <div class="card border-0">
                        <img src="${element.thumbnail}" class="card-img-top content_img">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-3 d-flex justify-content-end">
                                    <img src="${element.authors[0].profile_picture}" style="width: 42px; height: 45px; border-radius: 30px;" alt="" />
                                    <div class="text">${getTime(element.others.posted_date)}</div>
                                </div>
                                <div class="col-9">
                                    <b>${element.title} </b> <br>
                                    ${element.authors[0].profile_name}  <br> ${element.others.views} views
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    contents.innerHTML = html;
}

const getTime = (timestamp) => {
    const pastDate = moment.unix(timestamp);
    const currentDate = moment();
    const duration = moment.duration(currentDate.diff(pastDate));

    const hours = duration.hours();
    const minutes = duration.minutes();

    let timeAgoString = '';
    if (hours > 0) timeAgoString += hours + ' hrs ';
    if (minutes > 0) timeAgoString += minutes + ' min ';

    timeAgoString += 'ago';

    return timeAgoString;
}

const sortByViews = () => {
    getContent(1000).then(function (result) {
        let data = result.data;
        data.sort((a, b) => convertViewsToNumber(b.others.views) - convertViewsToNumber(a.others.views));
        displayContents(data);
    }).catch(function (error) {
        throw error;
    });
}

const convertViewsToNumber = (viewsString) => {
    return parseInt(viewsString.replace(/[^\d.]/g, '')) * (viewsString.includes('K') ? 1000 : 1);
}

const clickedButton = (id) => {
    let buttons = document.getElementsByClassName('buttons');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('btn-light');
        buttons[i].classList.remove('btn-danger');
    }

    let button = document.getElementById(`btn${id}`);
    button.classList.add('btn-danger');
    button.classList.remove('btn-light');
}


(async () => {
    await getCategories();
    await getContent(1000);
})();
