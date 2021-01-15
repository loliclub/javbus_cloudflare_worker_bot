const ajax_req = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:84.0) Gecko/20100101 Firefox/84.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.javbus.com"
    },
    method: "GET"
}

export async function reqJavbus(code) {

    let endpoint = "https://www.javbus.com/" + code
    let response = await fetch(endpoint, ajax_req)
    let responseText = await response.text()
    let title =  responseText.match(new RegExp(/<title>(.*)<\/title>/))[1]
    let gid = responseText.match(new RegExp(/gid.=.(\d*)/))[1]
    let img = responseText.match(new RegExp(/img.=.\'(.*)\'/))[1]

    // let magnetList = []
    // let nameList = []

    const ajax_url = `https://www.javbus.com/ajax/uncledatoolsbyajax.php?gid=${gid}&lang=zh&img=${img}&uc=0`

    let ajaxResponseText = await fetch(ajax_url, ajax_req).then((res) => res.text())

    let matchList = ajaxResponseText.match(new RegExp(/\<td.width.*\',/g))

    let magnetList =[]

    let resultList = []

    matchList.forEach((x) => {
        magnetList.push(x.match(new RegExp(/(magnet.*)&/))[1])
    })

    let matchList2 = ajaxResponseText.match(new RegExp(/.*\<\/a\>/gm))

    let tmpList = []
    for (let i = 0; i < matchList2.length/3; i++) {

        tmpList = matchList2.slice(i*3,(i+1)*3)
        resultList.push(
            {
                name:tmpList[0].match(new RegExp(/(\t)(.+?)</))[2].trim(),
                size:tmpList[1].replace('</a>','').trim(),
                magnet: magnetList[i],
                releaseDate:tmpList[2].replace('</a>','').trim(),
                is_hd:tmpList[0].includes('btn-warning'),
                has_subtitle:tmpList[0].includes('btn-primary')
            }
        )
    }

    return {title,img,resultList}
}