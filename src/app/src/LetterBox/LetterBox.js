import React, { Component } from 'react'
import '../css/LetterBox.css'

export default class LetterBox extends Component {
    render() {
        return (
            <div >
                <div className="col-tab">
                    信箱
                    <i className="iconfont icon-fanhui" 
                    style={{
                        position:"absolute",
                        left:"5%",
                        height:"2%",
                        fontSize:"1.2em"
                    }}></i>
                </div>
            </div>
        )
    }
}
