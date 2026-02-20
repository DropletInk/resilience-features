import express from 'express';
import expressLongPoll from "express-longpoll"

const app = express();

export const longpoll = expressLongPoll(app,{DEBUG:true})