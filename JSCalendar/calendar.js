// ES2015이상부턴 클래스로 가능, 혹시 안정화가 되면
// function에서 클래스로 바꾸길바람, 함수부분은 arrow 함수사용
function Calendar()
{
    this.element = null;
    this.nextObject = null;
    this.prevPostion = "";
    this.serialNum = Math.floor(Math.random() * 1000) + 1;
    this.years = new Date().getFullYear();
    this.month = new Date().getMonth();
    this.monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.whiteSpace = 0;
    Calendar.prototype.count = 0;

    // 요일
    this.dayOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

    this.onCreate = function(dom)
    {
        // exception Handling
        if(dom === null || dom === undefined || dom === NaN) return -1;

        // DOM validation Check
        let el = document.querySelector(dom);
        if(el === null || el === undefined) return -1;

        // 객체 비었을 경우 addEventListener 걸어줌
        if(this.element === null)
        {
            Calendar.prototype.count++;
            this.element = el;
            this.prevPostion = this.element.style.position;
            this.element.style.position = "relative";
            // 객체 찾을 시 이벤트 큐에 등록
            this.element.addEventListener("click", function()
            {
                // 년달 표시를 위한 Date 객체 선언
                let date = new Date();
                this.years = date.getFullYear();
                this.month = date.getMonth();

                let divEl = document.createElement("div");
                divEl.style.position = "absolute";

                let tableEl = document.createElement("table");
                divEl.appendChild(tableEl);
            
                // 테이블 프레임잡기
                tableEl.style.width = "50%";
                tableEl.style.backgroundColor = "white";
                tableEl.style.textAlign = "center";
                tableEl.className = "calendar" + this.serialNum;
                tableEl.style.position = "absolute";
                tableEl.style.top = 0;
                
                // 년/달 프레임
                let headerEl = document.createElement("tr");
                let headerThEl = document.createElement("th");
                // 년/달 이동 버튼
                let leftBtn = document.createElement("a");
                let rightBtn = document.createElement("a");

                leftBtn.textContent = "◀";
                leftBtn.className = "leftBtn" + this.serialNum;

                rightBtn.textContent = "▶";
                rightBtn.className = "rightBtn" + this.serialNum;


                headerEl.appendChild(leftBtn);

                // 년/달 표시
                headerThEl.textContent = this.years + "년 " + (this.month + 1) + "월";
                headerThEl.setAttribute("colspan", 5);
                headerThEl.className = "calendar_header";
                headerThEl.style.textAlign = "center";

                headerEl.appendChild(headerThEl);
                headerEl.appendChild(rightBtn);
                tableEl.appendChild(headerEl);

                // 월화수목금토일
                let trEl = document.createElement("tr");
                for(let i=0;i<7;i++)
                {
                    let thEl = document.createElement("th");
                    thEl.textContent = this.dayOfWeek[i];
                    thEl.style.textAlign = "center";
                    if(i==6) thEl.style.color = "red";
                    trEl.appendChild(thEl);
                }
                
            
                // 돔트리에 추가해주고 마무리
                tableEl.appendChild(trEl);
                this.drawing(tableEl, this.month);

                if(this.nextObject == null)
                {
                    this.nextObject = this.element.nextSibling;
                }

                this.nextObject.replaceWith(divEl);
                this.eventBinding();

                // 해제 이벤트
                document.querySelector("html").addEventListener("click", function(event){
                    
                    var calendarEl = document.querySelector(".calendar" + this.serialNum);
                    
                    if(this.element != event.target && calendarEl != null && event.target.tagName != "A")
                    {
                        this.element.style.position = this.prevPostion;
                        document.querySelector(".calendar" + this.serialNum).replaceWith(this.nextObject);
                        
                        return 0;
                    }
                }.bind(this));

            }.bind(this)); // eventListener this binding

           
        }
    };

    // 전 일까지 날짜 계산
    this.calculating = function(years, month)
    {
        // 전일 계산 
        let days = (years - 1) * 365 + (years - 1) / 4 - (years - 1) / 100 + (years - 1) / 400;
        
        for(let i=0;i < month;i++)
        {
            // 2월일 경우
            if(i === 1)
            {
                // 윤년이면 2월 29일까지
                if(((years%4 == 0 && years%100 != 0 || years%400 == 0))) this.monthDays[i] = 29;
                // 윤년아님
                else this.monthDays[i] = 28;
            }
            days += this.monthDays[i];
        }
        this.whiteSpace = parseInt(days % 7);
    };


    //실제 달력 그리는 함수
    this.drawing = function(table, month)
    {
        if(month <= -1) {
            this.years--; 
            month = 11;
        }else if(month >= 12) {
            this.years++; 
            month = 0; 
        }

        // monthDay 위에 배열값 month 최대값 11임..
        this.month = month;
        this.calculating(this.years, this.month);

        let firstTrEl = document.createElement("tr");
        firstTrEl.className = "day";

        if(this.whiteSpace != 6)
        {
            for(let i=0;i<=this.whiteSpace;i++)
            {
                let tdEl = document.createElement("td");
                tdEl.style.textAlign = "center";
                tdEl.style.textIndent = -10000000 + "px";
                tdEl.textContent = "빈칸";

                firstTrEl.appendChild(tdEl);
            }   
        }
        // 완성 된 뒤 루트에 부착
        table.appendChild(firstTrEl);

        // 이동하면서 생성할 것이다.
        let target = firstTrEl;
        for(let i=1;i<=this.monthDays[month];i++)
        {
            let tdEl = document.createElement("td");
            let aEl = document.createElement("a");

            aEl.textContent = i;

            // 일요일마다 빨간색
            if((this.whiteSpace + i + 1) % 7 == 0)
            {
                aEl.style.color = "red";
            }
            
            if((this.whiteSpace + i) % 7 == 0)
            {
                let trEl = document.createElement("tr");
                target = trEl;
                target.className = "day";
                table.appendChild(target);
            }

            aEl.addEventListener("click", function(event){
                monthValue = this.month + 1;
                dayValue = event.target.textContent;
                if(monthValue < 10) monthValue = "0" + (this.month + 1);
                if(dayValue < 10) dayValue = "0" + dayValue;

                this.element.value = this.years + "-" + monthValue + "-" + dayValue;
            }.bind(this));
                

            tdEl.appendChild(aEl);
            target.appendChild(tdEl);
        }// End Of FOR
    };// End Drawing

    // 상단 버튼 이벤트 부분
    this.eventBinding = function()
    {
        var cal = document.querySelector(".calendar" + this.serialNum);

        document.querySelector(".leftBtn" + this.serialNum).addEventListener("click", function(){
            removeDay();
           
            this.drawing(cal, this.month - 1);
            document.querySelector(".calendar_header").textContent = this.years + "년 " + (this.month + 1) + "월";
        }.bind(this));

        document.querySelector(".rightBtn" + this.serialNum).addEventListener("click", function(){
            removeDay();
            
            this.drawing(cal, this.month + 1);
            document.querySelector(".calendar_header").textContent = this.years + "년 " + (this.month + 1) + "월";
        }.bind(this));
    }

};

function removeDay()
{
    let dayArr = document.querySelectorAll(".day");

    for(let i=0;i<dayArr.length;i++)
    {
        dayArr[i].remove();
    }

}// End Of Remove

