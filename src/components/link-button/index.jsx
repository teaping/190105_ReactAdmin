import React, {Component} from 'react';
import './index.less'
import {
    NavLink
} from "react-router-dom";

/*
* 外形像连接的按钮
* */

export default function LinkButton(props) {

    return <button {...props} className="link-button"></button>
}