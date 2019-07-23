import './index'


const confirm = {
  show (content = '', cancelBtnText = '取消', confirmBtnText = '确定') {
    let divs = `
    <div name="confirm-fade">
      <div class="confirm" v-show="showFlag" @click.stop>
        <div class="confirm-wrapper">
          <div class="confirm-content">
            <p class="text">${content}</p>
            <div class="operate">
              <div class="operate-btn left">${cancelBtnText}</div>
              <div class="operate-btn">${confirmBtnText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`
    document.getElementsByTagName('body')[0].appendChild(divs)
  }
}

export default confirm