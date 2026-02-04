"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"

type QuestionTheme = "identity" | "shadow" | "emotion" | "desire" | "boundary" | "attachment" | "conflict" | "intimacy" | "future"

const themeColors: Record<QuestionTheme, { bg: string; border: string; hover: string; solid: string }> = {
  identity: { bg: "bg-[#9a8c7e]/20", border: "border-[#9a8c7e]/40", hover: "hover:border-[#9a8c7e] hover:bg-[#9a8c7e]/30", solid: "#9a8c7e" },
  shadow: { bg: "bg-[#7d8a8c]/20", border: "border-[#7d8a8c]/40", hover: "hover:border-[#7d8a8c] hover:bg-[#7d8a8c]/30", solid: "#7d8a8c" },
  emotion: { bg: "bg-[#a89590]/20", border: "border-[#a89590]/40", hover: "hover:border-[#a89590] hover:bg-[#a89590]/30", solid: "#a89590" },
  desire: { bg: "bg-[#8e9a7d]/20", border: "border-[#8e9a7d]/40", hover: "hover:border-[#8e9a7d] hover:bg-[#8e9a7d]/30", solid: "#8e9a7d" },
  boundary: { bg: "bg-[#998a9a]/20", border: "border-[#998a9a]/40", hover: "hover:border-[#998a9a] hover:bg-[#998a9a]/30", solid: "#998a9a" },
  attachment: { bg: "bg-[#8c9199]/20", border: "border-[#8c9199]/40", hover: "hover:border-[#8c9199] hover:bg-[#8c9199]/30", solid: "#8c9199" },
  conflict: { bg: "bg-[#a08a7a]/20", border: "border-[#a08a7a]/40", hover: "hover:border-[#a08a7a] hover:bg-[#a08a7a]/30", solid: "#a08a7a" },
  intimacy: { bg: "bg-[#8a9a90]/20", border: "border-[#8a9a90]/40", hover: "hover:border-[#8a9a90] hover:bg-[#8a9a90]/30", solid: "#8a9a90" },
  future: { bg: "bg-[#9a9a8a]/20", border: "border-[#9a9a8a]/40", hover: "hover:border-[#9a9a8a] hover:bg-[#9a9a8a]/30", solid: "#9a9a8a" },
}

interface Question {
  id: number
  theme: QuestionTheme
  question: string
  options: {
    text: string
    scores: { openness: number; stability: number; intimacy: number; autonomy: number; expression: number; trust: number }
  }[]
}

const questions: Question[] = [
  // 身份认同 (1-5)
  { id: 1, theme: "identity", question: "剧院失火了。你会——", options: [
    { text: "把手头的事做完再离开", scores: { openness: 2, stability: 4, intimacy: 3, autonomy: 5, expression: 2, trust: 3 } },
    { text: "在混乱中找到属于自己的节奏", scores: { openness: 5, stability: 3, intimacy: 2, autonomy: 4, expression: 5, trust: 3 } },
    { text: "观察出口位置后迅速撤离", scores: { openness: 3, stability: 5, intimacy: 2, autonomy: 4, expression: 2, trust: 2 } },
    { text: "帮助身边的人一起逃生", scores: { openness: 4, stability: 3, intimacy: 5, autonomy: 2, expression: 4, trust: 5 } },
  ]},
  { id: 2, theme: "identity", question: "你在一面只映照内心的镜子前，看到的是——", options: [
    { text: "一个比现实中更真实的自己", scores: { openness: 4, stability: 4, intimacy: 3, autonomy: 4, expression: 3, trust: 4 } },
    { text: "一个你从未见过的陌生人", scores: { openness: 5, stability: 2, intimacy: 2, autonomy: 3, expression: 2, trust: 2 } },
    { text: "一片空白", scores: { openness: 2, stability: 2, intimacy: 1, autonomy: 5, expression: 1, trust: 2 } },
    { text: "无数个重叠的影像", scores: { openness: 3, stability: 1, intimacy: 3, autonomy: 4, expression: 5, trust: 1 } },
  ]},
  { id: 3, theme: "identity", question: "如果你的人生是一场戏，你在其中扮演的是——", options: [
    { text: "不断修改剧本的编剧", scores: { openness: 4, stability: 3, intimacy: 2, autonomy: 5, expression: 3, trust: 2 } },
    { text: "忠实演绎角色的演员", scores: { openness: 3, stability: 4, intimacy: 4, autonomy: 2, expression: 4, trust: 4 } },
    { text: "坐在台下的唯一观众", scores: { openness: 2, stability: 4, intimacy: 1, autonomy: 4, expression: 1, trust: 3 } },
    { text: "打翻了所有道具的闯入者", scores: { openness: 5, stability: 1, intimacy: 3, autonomy: 5, expression: 5, trust: 1 } },
  ]},
  { id: 4, theme: "identity", question: "一个没有任何人认识你的城市，你感到——", options: [
    { text: "自由", scores: { openness: 5, stability: 3, intimacy: 1, autonomy: 5, expression: 3, trust: 2 } },
    { text: "恐惧", scores: { openness: 2, stability: 2, intimacy: 5, autonomy: 1, expression: 3, trust: 4 } },
    { text: "好奇", scores: { openness: 5, stability: 4, intimacy: 3, autonomy: 4, expression: 4, trust: 3 } },
    { text: "无所谓", scores: { openness: 2, stability: 5, intimacy: 2, autonomy: 4, expression: 1, trust: 2 } },
  ]},
  { id: 5, theme: "identity", question: "当别人问起「你是什么样的人」，你通常会——", options: [
    { text: "给出一个精心准备的答案", scores: { openness: 3, stability: 4, intimacy: 3, autonomy: 3, expression: 2, trust: 2 } },
    { text: "视情况给出不同的回答", scores: { openness: 4, stability: 3, intimacy: 2, autonomy: 4, expression: 3, trust: 2 } },
    { text: "坦诚地说不太清楚", scores: { openness: 3, stability: 2, intimacy: 3, autonomy: 3, expression: 2, trust: 3 } },
    { text: "反问对方想听什么", scores: { openness: 4, stability: 3, intimacy: 4, autonomy: 2, expression: 4, trust: 3 } },
  ]},
  // 阴影面 (6-10)
  { id: 6, theme: "shadow", question: "你最不愿意承认的事实是——", options: [
    { text: "你享受被需要的感觉", scores: { openness: 3, stability: 3, intimacy: 5, autonomy: 2, expression: 4, trust: 4 } },
    { text: "你有时候根本不在乎别人", scores: { openness: 2, stability: 4, intimacy: 1, autonomy: 5, expression: 2, trust: 2 } },
    { text: "你害怕真正的亲密", scores: { openness: 2, stability: 2, intimacy: 4, autonomy: 4, expression: 2, trust: 1 } },
    { text: "你总是在等待被拯救", scores: { openness: 2, stability: 2, intimacy: 5, autonomy: 1, expression: 3, trust: 3 } },
  ]},
  { id: 7, theme: "shadow", question: "深夜三点，你醒来后的第一个念头是——", options: [
    { text: "明天还有事没做完", scores: { openness: 2, stability: 2, intimacy: 2, autonomy: 4, expression: 2, trust: 3 } },
    { text: "某个人此刻在做什么", scores: { openness: 3, stability: 2, intimacy: 5, autonomy: 2, expression: 4, trust: 3 } },
    { text: "这种失眠何时是个头", scores: { openness: 2, stability: 1, intimacy: 3, autonomy: 3, expression: 2, trust: 2 } },
    { text: "终于有独处的时间了", scores: { openness: 3, stability: 4, intimacy: 1, autonomy: 5, expression: 2, trust: 3 } },
  ]},
  { id: 8, theme: "shadow", question: "你曾经做过的、现在想起仍感羞耻的事，你会——", options: [
    { text: "反复回想，试图找到合理化的解释", scores: { openness: 3, stability: 2, intimacy: 3, autonomy: 3, expression: 2, trust: 2 } },
    { text: "强迫自己忘记它", scores: { openness: 1, stability: 3, intimacy: 2, autonomy: 4, expression: 1, trust: 3 } },
    { text: "承认它是你的一部分", scores: { openness: 5, stability: 4, intimacy: 4, autonomy: 4, expression: 4, trust: 4 } },
    { text: "把它变成一个可以讲的故事", scores: { openness: 5, stability: 3, intimacy: 4, autonomy: 3, expression: 5, trust: 4 } },
  ]},
  { id: 9, theme: "shadow", question: "你嫉妒的人通常是——", options: [
    { text: "看起来毫不费力就得到一切的人", scores: { openness: 2, stability: 2, intimacy: 3, autonomy: 3, expression: 3, trust: 2 } },
    { text: "敢于做你不敢做之事的人", scores: { openness: 4, stability: 2, intimacy: 3, autonomy: 2, expression: 4, trust: 3 } },
    { text: "被所有人喜爱的人", scores: { openness: 3, stability: 2, intimacy: 5, autonomy: 2, expression: 4, trust: 3 } },
    { text: "你不嫉妒任何人", scores: { openness: 2, stability: 5, intimacy: 2, autonomy: 5, expression: 2, trust: 3 } },
  ]},
  { id: 10, theme: "shadow", question: "当有人说「你变了」，你的反应是——", options: [
    { text: "试图解释自己为什么改变", scores: { openness: 3, stability: 3, intimacy: 4, autonomy: 2, expression: 4, trust: 3 } },
    { text: "感到被误解的愤怒", scores: { openness: 2, stability: 2, intimacy: 3, autonomy: 4, expression: 4, trust: 2 } },
    { text: "默默接受这个评价", scores: { openness: 2, stability: 4, intimacy: 3, autonomy: 3, expression: 1, trust: 3 } },
    { text: "反问「变好还是变坏」", scores: { openness: 4, stability: 3, intimacy: 3, autonomy: 4, expression: 4, trust: 2 } },
  ]},
  // 情感倾向 (11-15)
  { id: 11, theme: "emotion", question: "对你来说，爱更像是——", options: [
    { text: "一场值得投入的冒险", scores: { openness: 5, stability: 2, intimacy: 5, autonomy: 3, expression: 5, trust: 4 } },
    { text: "一种需要维护的契约", scores: { openness: 2, stability: 5, intimacy: 3, autonomy: 4, expression: 2, trust: 3 } },
    { text: "一个无法解开的谜题", scores: { openness: 4, stability: 2, intimacy: 3, autonomy: 3, expression: 2, trust: 2 } },
    { text: "一种本能的归属感", scores: { openness: 3, stability: 4, intimacy: 5, autonomy: 2, expression: 4, trust: 5 } },
  ]},
  { id: 12, theme: "emotion", question: "在关系中，你最难以忍受的是——", options: [
    { text: "对方的沉默", scores: { openness: 4, stability: 2, intimacy: 5, autonomy: 2, expression: 5, trust: 3 } },
    { text: "对方的不诚实", scores: { openness: 3, stability: 3, intimacy: 3, autonomy: 3, expression: 3, trust: 1 } },
    { text: "对方试图改变你", scores: { openness: 2, stability: 3, intimacy: 2, autonomy: 5, expression: 3, trust: 2 } },
    { text: "对方的过度依赖", scores: { openness: 3, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 3 } },
  ]},
  { id: 13, theme: "emotion", question: "分手后的第一周，你通常会——", options: [
    { text: "把自己填满，不给悲伤留空隙", scores: { openness: 2, stability: 3, intimacy: 2, autonomy: 4, expression: 1, trust: 2 } },
    { text: "反复检讨哪里出了问题", scores: { openness: 3, stability: 2, intimacy: 4, autonomy: 2, expression: 3, trust: 2 } },
    { text: "感到一种奇怪的解脱", scores: { openness: 3, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 3 } },
    { text: "试图挽回或至少保持联系", scores: { openness: 3, stability: 1, intimacy: 5, autonomy: 1, expression: 4, trust: 4 } },
  ]},
  { id: 14, theme: "emotion", question: "你在感情中说过最多的谎是——", options: [
    { text: "「我没事」", scores: { openness: 2, stability: 3, intimacy: 3, autonomy: 4, expression: 1, trust: 3 } },
    { text: "「我不在乎」", scores: { openness: 2, stability: 3, intimacy: 4, autonomy: 4, expression: 2, trust: 2 } },
    { text: "「我相信你」", scores: { openness: 2, stability: 2, intimacy: 4, autonomy: 2, expression: 2, trust: 1 } },
    { text: "你几乎不说谎", scores: { openness: 4, stability: 4, intimacy: 4, autonomy: 3, expression: 4, trust: 4 } },
  ]},
  { id: 15, theme: "emotion", question: "当对方情绪低落时，你会——", options: [
    { text: "立刻询问发生了什么", scores: { openness: 4, stability: 3, intimacy: 5, autonomy: 2, expression: 4, trust: 4 } },
    { text: "默默陪在旁边", scores: { openness: 3, stability: 4, intimacy: 4, autonomy: 3, expression: 2, trust: 4 } },
    { text: "给对方独处的空间", scores: { openness: 3, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 3 } },
    { text: "尝试让对方转移注意力", scores: { openness: 4, stability: 3, intimacy: 4, autonomy: 3, expression: 4, trust: 3 } },
  ]},
  // 欲望 (16-20)
  { id: 16, theme: "desire", question: "如果可以无条件实现一个愿望，你会选择——", options: [
    { text: "永远不再感到孤独", scores: { openness: 3, stability: 2, intimacy: 5, autonomy: 1, expression: 4, trust: 4 } },
    { text: "拥有看透一切的能力", scores: { openness: 5, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 1 } },
    { text: "获得不受约束的自由", scores: { openness: 5, stability: 3, intimacy: 1, autonomy: 5, expression: 3, trust: 2 } },
    { text: "让某个时刻永远定格", scores: { openness: 2, stability: 3, intimacy: 4, autonomy: 2, expression: 3, trust: 4 } },
  ]},
  { id: 17, theme: "desire", question: "你理想中的伴侣应该——", options: [
    { text: "完全理解你", scores: { openness: 3, stability: 3, intimacy: 5, autonomy: 2, expression: 3, trust: 5 } },
    { text: "给你足够的空间", scores: { openness: 3, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 3 } },
    { text: "和你势均力敌", scores: { openness: 4, stability: 4, intimacy: 4, autonomy: 4, expression: 4, trust: 3 } },
    { text: "带给你惊喜和刺激", scores: { openness: 5, stability: 2, intimacy: 4, autonomy: 3, expression: 5, trust: 3 } },
  ]},
  { id: 18, theme: "desire", question: "你更渴望被人记住的方式是——", options: [
    { text: "作为一个有趣的人", scores: { openness: 5, stability: 3, intimacy: 4, autonomy: 3, expression: 5, trust: 4 } },
    { text: "作为一个可靠的人", scores: { openness: 2, stability: 5, intimacy: 4, autonomy: 3, expression: 2, trust: 5 } },
    { text: "作为一个深刻的人", scores: { openness: 4, stability: 3, intimacy: 3, autonomy: 4, expression: 3, trust: 3 } },
    { text: "你不太在意被如何记住", scores: { openness: 3, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 2 } },
  ]},
  { id: 19, theme: "desire", question: "当欲望与道德冲突时，你通常会——", options: [
    { text: "找到一个两全其美的方案", scores: { openness: 4, stability: 4, intimacy: 3, autonomy: 4, expression: 3, trust: 3 } },
    { text: "压下欲望，遵从道德", scores: { openness: 2, stability: 5, intimacy: 3, autonomy: 2, expression: 2, trust: 4 } },
    { text: "跟随欲望，承担后果", scores: { openness: 5, stability: 2, intimacy: 3, autonomy: 5, expression: 5, trust: 2 } },
    { text: "陷入长久的犹豫", scores: { openness: 3, stability: 1, intimacy: 3, autonomy: 2, expression: 2, trust: 2 } },
  ]},
  { id: 20, theme: "desire", question: "你对「完美的一天」的定义是——", options: [
    { text: "和重要的人在一起，做什么都行", scores: { openness: 3, stability: 4, intimacy: 5, autonomy: 2, expression: 4, trust: 5 } },
    { text: "独自完成一件有意义的事", scores: { openness: 4, stability: 4, intimacy: 1, autonomy: 5, expression: 2, trust: 3 } },
    { text: "经历一些意想不到的事", scores: { openness: 5, stability: 2, intimacy: 3, autonomy: 4, expression: 4, trust: 3 } },
    { text: "什么都不做，彻底放空", scores: { openness: 2, stability: 5, intimacy: 2, autonomy: 4, expression: 1, trust: 3 } },
  ]},
  // 边界感 (21-25)
  { id: 21, theme: "boundary", question: "有人闯入你的私人空间时，你会——", options: [
    { text: "明确告知对方你的边界", scores: { openness: 3, stability: 4, intimacy: 2, autonomy: 5, expression: 4, trust: 2 } },
    { text: "假装不介意，但内心不适", scores: { openness: 2, stability: 2, intimacy: 4, autonomy: 2, expression: 1, trust: 3 } },
    { text: "视对方是谁而定", scores: { openness: 3, stability: 3, intimacy: 3, autonomy: 3, expression: 3, trust: 3 } },
    { text: "你的边界本就模糊", scores: { openness: 4, stability: 2, intimacy: 4, autonomy: 2, expression: 3, trust: 4 } },
  ]},
  { id: 22, theme: "boundary", question: "你能接受伴侣翻看你的手机吗？", options: [
    { text: "完全可以，没什么不能看的", scores: { openness: 4, stability: 4, intimacy: 5, autonomy: 2, expression: 4, trust: 5 } },
    { text: "完全不行，这是原则问题", scores: { openness: 2, stability: 4, intimacy: 2, autonomy: 5, expression: 3, trust: 2 } },
    { text: "可以，但希望对方先告知", scores: { openness: 3, stability: 4, intimacy: 4, autonomy: 3, expression: 3, trust: 3 } },
    { text: "取决于你们的关系阶段", scores: { openness: 4, stability: 3, intimacy: 3, autonomy: 3, expression: 3, trust: 3 } },
  ]},
  { id: 23, theme: "boundary", question: "当朋友的要求让你为难时，你会——", options: [
    { text: "答应，但之后感到疲惫", scores: { openness: 2, stability: 2, intimacy: 5, autonomy: 1, expression: 2, trust: 4 } },
    { text: "找理由婉拒", scores: { openness: 2, stability: 4, intimacy: 3, autonomy: 4, expression: 2, trust: 2 } },
    { text: "直接说不", scores: { openness: 3, stability: 5, intimacy: 2, autonomy: 5, expression: 4, trust: 2 } },
    { text: "答应，并不觉得有什么问题", scores: { openness: 3, stability: 3, intimacy: 5, autonomy: 2, expression: 3, trust: 5 } },
  ]},
  { id: 24, theme: "boundary", question: "你的秘密通常会——", options: [
    { text: "永远烂在肚子里", scores: { openness: 1, stability: 5, intimacy: 1, autonomy: 5, expression: 1, trust: 2 } },
    { text: "只告诉一个最信任的人", scores: { openness: 2, stability: 4, intimacy: 4, autonomy: 3, expression: 3, trust: 4 } },
    { text: "说着说着就说出去了", scores: { openness: 4, stability: 2, intimacy: 5, autonomy: 2, expression: 5, trust: 4 } },
    { text: "变成有趣的故事讲给大家听", scores: { openness: 5, stability: 3, intimacy: 4, autonomy: 3, expression: 5, trust: 4 } },
  ]},
  { id: 25, theme: "boundary", question: "在感情中，你认为两个人应该——", options: [
    { text: "无话不谈，毫无保留", scores: { openness: 4, stability: 3, intimacy: 5, autonomy: 1, expression: 5, trust: 5 } },
    { text: "保持适度的神秘感", scores: { openness: 3, stability: 4, intimacy: 3, autonomy: 4, expression: 3, trust: 3 } },
    { text: "各自保留一些私人领域", scores: { openness: 3, stability: 5, intimacy: 3, autonomy: 5, expression: 2, trust: 3 } },
    { text: "随着关系深入逐渐开放", scores: { openness: 4, stability: 4, intimacy: 4, autonomy: 3, expression: 4, trust: 4 } },
  ]},
  // 依恋模式 (26-30)
  { id: 26, theme: "attachment", question: "在关系里，你更怕的是——", options: [
    { text: "被抛弃", scores: { openness: 2, stability: 1, intimacy: 5, autonomy: 1, expression: 3, trust: 2 } },
    { text: "被束缚", scores: { openness: 4, stability: 3, intimacy: 2, autonomy: 5, expression: 3, trust: 2 } },
    { text: "被误解", scores: { openness: 3, stability: 2, intimacy: 4, autonomy: 3, expression: 4, trust: 2 } },
    { text: "被看穿", scores: { openness: 2, stability: 2, intimacy: 3, autonomy: 4, expression: 2, trust: 1 } },
  ]},
  { id: 27, theme: "attachment", question: "伴侣出差一周，你会——", options: [
    { text: "频繁联系，分享日常", scores: { openness: 3, stability: 3, intimacy: 5, autonomy: 2, expression: 5, trust: 4 } },
    { text: "偶尔问候，保持独立", scores: { openness: 3, stability: 5, intimacy: 3, autonomy: 5, expression: 2, trust: 4 } },
    { text: "期待重逢，但享受独处", scores: { openness: 4, stability: 4, intimacy: 4, autonomy: 4, expression: 3, trust: 4 } },
    { text: "焦虑不安，担心变故", scores: { openness: 2, stability: 1, intimacy: 5, autonomy: 1, expression: 3, trust: 1 } },
  ]},
  { id: 28, theme: "attachment", question: "你更容易被什么吸引——", options: [
    { text: "稳定可靠，让你安心的人", scores: { openness: 2, stability: 5, intimacy: 4, autonomy: 2, expression: 2, trust: 5 } },
    { text: "神秘莫测，让你好奇的人", scores: { openness: 5, stability: 2, intimacy: 3, autonomy: 3, expression: 3, trust: 2 } },
    { text: "热情主动，让你感到被需要的人", scores: { openness: 3, stability: 3, intimacy: 5, autonomy: 2, expression: 4, trust: 4 } },
    { text: "独立自主，让你有空间的人", scores: { openness: 4, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 3 } },
  ]},
  { id: 29, theme: "attachment", question: "吵架之后，你通常会——", options: [
    { text: "主动和解，害怕关系破裂", scores: { openness: 3, stability: 2, intimacy: 5, autonomy: 1, expression: 4, trust: 3 } },
    { text: "冷静分析，等待合适的时机", scores: { openness: 3, stability: 5, intimacy: 3, autonomy: 4, expression: 2, trust: 3 } },
    { text: "需要独处，消化情绪", scores: { openness: 2, stability: 3, intimacy: 2, autonomy: 5, expression: 2, trust: 3 } },
    { text: "直接表达，把话说清楚", scores: { openness: 4, stability: 3, intimacy: 4, autonomy: 4, expression: 5, trust: 3 } },
  ]},
  { id: 30, theme: "attachment", question: "如果用一个词形容你在感情中的状态，那会是——", options: [
    { text: "寻找", scores: { openness: 4, stability: 2, intimacy: 5, autonomy: 2, expression: 3, trust: 3 } },
    { text: "守护", scores: { openness: 2, stability: 5, intimacy: 4, autonomy: 3, expression: 3, trust: 5 } },
    { text: "观望", scores: { openness: 3, stability: 4, intimacy: 2, autonomy: 4, expression: 2, trust: 2 } },
    { text: "游走", scores: { openness: 5, stability: 2, intimacy: 2, autonomy: 5, expression: 3, trust: 2 } },
  ]},
  // 冲突处理 (31-35)
  { id: 31, theme: "conflict", question: "发现伴侣说了一个小谎，你会——", options: [
    { text: "直接质问，要求解释", scores: { openness: 3, stability: 2, intimacy: 4, autonomy: 4, expression: 5, trust: 1 } },
    { text: "假装没发现，但心里记着", scores: { openness: 2, stability: 3, intimacy: 3, autonomy: 3, expression: 1, trust: 2 } },
    { text: "找个合适的时机委婉提起", scores: { openness: 3, stability: 4, intimacy: 4, autonomy: 3, expression: 3, trust: 3 } },
    { text: "视情况决定是否追究", scores: { openness: 4, stability: 4, intimacy: 3, autonomy: 4, expression: 3, trust: 3 } },
  ]},
  { id: 32, theme: "conflict", question: "争吵时，你更常用的武器是——", options: [
    { text: "沉默", scores: { openness: 2, stability: 3, intimacy: 2, autonomy: 4, expression: 1, trust: 2 } },
    { text: "逻辑", scores: { openness: 3, stability: 5, intimacy: 2, autonomy: 4, expression: 3, trust: 2 } },
    { text: "眼泪", scores: { openness: 3, stability: 1, intimacy: 5, autonomy: 1, expression: 4, trust: 3 } },
    { text: "翻旧账", scores: { openness: 2, stability: 2, intimacy: 4, autonomy: 3, expression: 4, trust: 1 } },
  ]},
  { id: 33, theme: "conflict", question: "当对方的朋友/家人对你有意见时，你希望伴侣——", options: [
    { text: "公开站在你这边", scores: { openness: 3, stability: 2, intimacy: 5, autonomy: 2, expression: 4, trust: 4 } },
    { text: "私下安慰你，公开保持中立", scores: { openness: 3, stability: 4, intimacy: 4, autonomy: 3, expression: 2, trust: 3 } },
    { text: "帮你分析问题出在哪里", scores: { openness: 4, stability: 4, intimacy: 3, autonomy: 4, expression: 3, trust: 3 } },
    { text: "让你自己处理", scores: { openness: 2, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 2 } },
  ]},
  { id: 34, theme: "conflict", question: "你更难以原谅的是——", options: [
    { text: "一次严重的背叛", scores: { openness: 2, stability: 3, intimacy: 4, autonomy: 3, expression: 3, trust: 1 } },
    { text: "无数次的小失望", scores: { openness: 3, stability: 2, intimacy: 4, autonomy: 4, expression: 3, trust: 2 } },
    { text: "被公开羞辱", scores: { openness: 2, stability: 2, intimacy: 3, autonomy: 5, expression: 4, trust: 2 } },
    { text: "你比较容易原谅", scores: { openness: 4, stability: 4, intimacy: 5, autonomy: 2, expression: 3, trust: 5 } },
  ]},
  { id: 35, theme: "conflict", question: "关系中出现问题时，你的第一反应是——", options: [
    { text: "是我做错了什么吗", scores: { openness: 3, stability: 2, intimacy: 5, autonomy: 1, expression: 3, trust: 3 } },
    { text: "需要冷静分析原因", scores: { openness: 3, stability: 5, intimacy: 3, autonomy: 4, expression: 2, trust: 3 } },
    { text: "也许不适合就是不适合", scores: { openness: 3, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 2 } },
    { text: "先解决情绪再解决问题", scores: { openness: 4, stability: 3, intimacy: 4, autonomy: 3, expression: 4, trust: 4 } },
  ]},
  // 亲密关系 (36-40)
  { id: 36, theme: "intimacy", question: "对你来说，最亲密的时刻是——", options: [
    { text: "深夜的长谈", scores: { openness: 4, stability: 3, intimacy: 5, autonomy: 2, expression: 5, trust: 5 } },
    { text: "无言的默契", scores: { openness: 3, stability: 4, intimacy: 4, autonomy: 3, expression: 2, trust: 5 } },
    { text: "一起经历困难", scores: { openness: 4, stability: 4, intimacy: 5, autonomy: 3, expression: 4, trust: 5 } },
    { text: "各做各的，但在一起", scores: { openness: 3, stability: 5, intimacy: 3, autonomy: 5, expression: 2, trust: 4 } },
  ]},
  { id: 37, theme: "intimacy", question: "你更难以表达的是——", options: [
    { text: "「我需要你」", scores: { openness: 2, stability: 3, intimacy: 4, autonomy: 5, expression: 2, trust: 2 } },
    { text: "「我很受伤」", scores: { openness: 2, stability: 2, intimacy: 3, autonomy: 4, expression: 1, trust: 2 } },
    { text: "「我爱你」", scores: { openness: 2, stability: 4, intimacy: 4, autonomy: 3, expression: 2, trust: 3 } },
    { text: "你都能轻松表达", scores: { openness: 5, stability: 4, intimacy: 5, autonomy: 3, expression: 5, trust: 4 } },
  ]},
  { id: 38, theme: "intimacy", question: "在关系的稳定期，你会——", options: [
    { text: "感到安心和满足", scores: { openness: 3, stability: 5, intimacy: 4, autonomy: 3, expression: 3, trust: 5 } },
    { text: "有点无聊，想制造点波澜", scores: { openness: 5, stability: 2, intimacy: 3, autonomy: 4, expression: 4, trust: 3 } },
    { text: "担心这种平静不会持久", scores: { openness: 2, stability: 1, intimacy: 4, autonomy: 2, expression: 2, trust: 1 } },
    { text: "开始关注自己的其他领域", scores: { openness: 4, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 4 } },
  ]},
  { id: 39, theme: "intimacy", question: "你希望伴侣了解你的程度是——", options: [
    { text: "完全透明，包括最黑暗的部分", scores: { openness: 5, stability: 3, intimacy: 5, autonomy: 2, expression: 5, trust: 5 } },
    { text: "了解大部分，保留一点神秘", scores: { openness: 3, stability: 4, intimacy: 4, autonomy: 4, expression: 3, trust: 4 } },
    { text: "了解你选择展示的那个版本", scores: { openness: 2, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 2 } },
    { text: "你自己也不完全了解自己", scores: { openness: 4, stability: 2, intimacy: 3, autonomy: 3, expression: 3, trust: 3 } },
  ]},
  { id: 40, theme: "intimacy", question: "什么会让你觉得被深深理解——", options: [
    { text: "对方记得你说过的小细节", scores: { openness: 3, stability: 3, intimacy: 5, autonomy: 2, expression: 4, trust: 5 } },
    { text: "对方能读懂你的沉默", scores: { openness: 3, stability: 4, intimacy: 5, autonomy: 3, expression: 2, trust: 5 } },
    { text: "对方接受你最不堪的一面", scores: { openness: 4, stability: 3, intimacy: 5, autonomy: 3, expression: 4, trust: 5 } },
    { text: "对方给你做自己的空间", scores: { openness: 3, stability: 5, intimacy: 3, autonomy: 5, expression: 2, trust: 4 } },
  ]},
  // 未来愿景 (41-45)
  { id: 41, theme: "future", question: "你对「长久」的理解是——", options: [
    { text: "一辈子", scores: { openness: 2, stability: 5, intimacy: 5, autonomy: 2, expression: 3, trust: 5 } },
    { text: "直到不再合适为止", scores: { openness: 4, stability: 3, intimacy: 3, autonomy: 5, expression: 3, trust: 3 } },
    { text: "不去想那么远", scores: { openness: 3, stability: 3, intimacy: 2, autonomy: 4, expression: 2, trust: 2 } },
    { text: "每一天都是新的选择", scores: { openness: 5, stability: 2, intimacy: 3, autonomy: 5, expression: 3, trust: 3 } },
  ]},
  { id: 42, theme: "future", question: "如果关系走到尽头，你希望——", options: [
    { text: "好聚好散，保持体面", scores: { openness: 3, stability: 5, intimacy: 3, autonomy: 4, expression: 2, trust: 3 } },
    { text: "彻底切断，不再联系", scores: { openness: 2, stability: 4, intimacy: 2, autonomy: 5, expression: 2, trust: 1 } },
    { text: "还能做朋友", scores: { openness: 4, stability: 3, intimacy: 4, autonomy: 3, expression: 4, trust: 4 } },
    { text: "至少弄清楚为什么", scores: { openness: 4, stability: 2, intimacy: 4, autonomy: 3, expression: 4, trust: 3 } },
  ]},
  { id: 43, theme: "future", question: "关于婚姻/长期承诺，你的态度是——", options: [
    { text: "是爱情的自然归宿", scores: { openness: 2, stability: 5, intimacy: 5, autonomy: 2, expression: 3, trust: 5 } },
    { text: "只是一种形式，不影响感情本质", scores: { openness: 4, stability: 4, intimacy: 3, autonomy: 5, expression: 2, trust: 3 } },
    { text: "有点恐惧，担心失去自由", scores: { openness: 3, stability: 2, intimacy: 3, autonomy: 5, expression: 3, trust: 2 } },
    { text: "遇到对的人再说", scores: { openness: 4, stability: 3, intimacy: 4, autonomy: 3, expression: 3, trust: 4 } },
  ]},
  { id: 44, theme: "future", question: "十年后的你，最可能——", options: [
    { text: "和某个人一起慢慢变老", scores: { openness: 2, stability: 5, intimacy: 5, autonomy: 2, expression: 3, trust: 5 } },
    { text: "独自过着自在的生活", scores: { openness: 4, stability: 4, intimacy: 1, autonomy: 5, expression: 2, trust: 3 } },
    { text: "还在寻找那个对的人", scores: { openness: 4, stability: 2, intimacy: 4, autonomy: 3, expression: 3, trust: 3 } },
    { text: "无法预测，顺其自然", scores: { openness: 5, stability: 3, intimacy: 3, autonomy: 4, expression: 3, trust: 3 } },
  ]},
  { id: 45, theme: "future", question: "如果可以给年轻时的自己一个关于爱情的忠告，你会说——", options: [
    { text: "不要害怕受伤", scores: { openness: 5, stability: 3, intimacy: 5, autonomy: 3, expression: 4, trust: 4 } },
    { text: "先学会爱自己", scores: { openness: 3, stability: 4, intimacy: 3, autonomy: 5, expression: 3, trust: 3 } },
    { text: "爱情没有你想象的那么重要", scores: { openness: 3, stability: 5, intimacy: 2, autonomy: 5, expression: 2, trust: 3 } },
    { text: "相信你的直觉", scores: { openness: 4, stability: 3, intimacy: 4, autonomy: 4, expression: 4, trust: 4 } },
  ]},
]

// 动物类型
type AnimalType = "wolf" | "cat" | "rabbit" | "fox" | "owl" | "deer"

const animalNames: Record<AnimalType, string> = {
  wolf: "狼", cat: "猫", rabbit: "兔", fox: "狐", owl: "鸮", deer: "鹿"
}

const animalDescriptions: Record<AnimalType, string> = {
  wolf: "领地意识强烈，忠诚但警惕，渴望群体却保持距离",
  cat: "优雅独立，若即若离，用冷漠包装深情",
  rabbit: "敏感柔软，渴望安全，在爱中寻找庇护所",
  fox: "聪明灵活，善于观察，在亲密与疏离间游走",
  owl: "深邃理性，洞察人心，在黑暗中寻找真相",
  deer: "温柔警觉，容易受惊，在信任与逃离间挣扎"
}

// 组合式人格称号
interface ArchetypeResult {
  title: string
  subtitle: string
  animal: AnimalType
  profile: string  // 剧场侧写
  blindSpot: string  // 恋爱盲点
  soulMatch: string  // 灵魂共振
  keywords: string[]  // 关键词云
  compatibility: number  // 适配度
  detailAnalysis: string
}

function getAnimalType(scores: Record<string, number>): AnimalType {
  const { autonomy, intimacy, trust, stability, openness, expression } = scores
  
  if (autonomy > 60 && trust < 45 && stability > 55) return "wolf"
  if (autonomy > 55 && expression < 45 && openness > 50) return "cat"
  if (intimacy > 60 && autonomy < 45 && trust > 50) return "rabbit"
  if (openness > 60 && stability < 50 && expression > 50) return "fox"
  if (stability > 60 && expression < 50 && openness < 50) return "owl"
  return "deer"
}

function getArchetype(scores: Record<string, number>): ArchetypeResult {
  const { openness, stability, intimacy, autonomy, expression, trust } = scores
  
  const animal = getAnimalType(scores)
  const darkScore = (100 - trust) + (100 - stability) + autonomy
  const purityScore = stability + trust + (100 - openness)
  
  // 8种组合称号
  if (animal === "wolf" && darkScore > 180) {
    return {
      title: "荒原独狼",
      subtitle: "The Lone Wolf of Wasteland",
      animal: "wolf",
      profile: "你坐在关系的边界线上，一只脚踏入，一只脚随时准备撤退。你的爱是有条件的忠诚——条件是：不被驯服。",
      blindSpot: "你总以为距离产生美，殊不知距离也产生误解。当你忙着保护自己的领地时，对方可能已经在门外等得太久，转身离开了。",
      soulMatch: "能够尊重你边界、不试图改变你、却又能在关键时刻让你感到被需要的人。大概率是另一只温和的狼，或者一只懂得等待的猫。",
      keywords: ["独立", "警惕", "领地", "忠诚", "距离感", "保护欲", "不妥协"],
      compatibility: 65,
      detailAnalysis: "你的爱像狼群的法则——等级分明，边界清晰。你不是不会爱，而是太懂得保护自己。这让你在关系中显得强大，却也可能让真心靠近的人望而却步。试着偶尔放下戒备，让某个人看见城墙后面那个也会受伤的你。"
    }
  }
  
  if (animal === "cat" && darkScore > 160) {
    return {
      title: "优雅的掠食者",
      subtitle: "The Elegant Predator",
      animal: "cat",
      profile: "你在关系中扮演的是那个「看起来不在乎」的角色，但你的眼睛从未离开过猎物。你用漫不经心掩盖专注，用冷淡包装深情。",
      blindSpot: "你太擅长隐藏了，以至于连自己都忘了在演戏。当你终于想表达真心时，对方可能已经习惯了你的「不在乎」，不再相信任何温柔。",
      soulMatch: "一个能看穿你伪装、却不拆穿你的人。最好是足够敏感能读懂你的信号，又足够强大不会被你的冷淡吓跑。",
      keywords: ["矜持", "观察", "伪装", "优雅", "距离", "试探", "高傲"],
      compatibility: 58,
      detailAnalysis: "你是恋爱中的策略家，每一步都精心计算。这让你很少受伤，但也让你很少真正快乐。你最大的恐惧不是被拒绝，而是被看穿——被看穿之后，还能被接受吗？答案是：能。试着让某个人看见真实的你。"
    }
  }
  
  if (animal === "rabbit" && purityScore > 200) {
    return {
      title: "被写好的剧本",
      subtitle: "The Scripted Dreamer", 
      animal: "rabbit",
      profile: "你是爱情故事里最虔诚的读者，相信每一个童话结局，愿意为浪漫付出一切。你坐在第一排，举着最大的荧光棒，等待属于你的主角出场。",
      blindSpot: "你太想要一个完美的爱情故事了，以至于忽略了现实中的人都是带着缺陷的。当对方无法满足你的剧本期待时，你会失望，而不是调整剧本。",
      soulMatch: "一个愿意和你一起相信童话、却也能在必要时把你拉回现实的人。大概率是一个温柔但有主见的存在。",
      keywords: ["浪漫", "理想", "纯真", "期待", "脆弱", "信任", "付出"],
      compatibility: 72,
      detailAnalysis: "你的爱是无条件的给予，这是你最美的地方，也是最危险的地方。你需要学会的不是如何少爱一点，而是如何爱得更聪明一点。不是每个人都值得你掏心掏肺，但值得的那个人，会让你的付出得到回报。"
    }
  }
  
  if (animal === "fox" && openness > 60 && stability < 45) {
    return {
      title: "镜厅的舞者",
      subtitle: "The Hall of Mirrors Dancer",
      animal: "fox",
      profile: "你在关系中像一个永远在换面具的舞者，每一面镜子都映射出不同的你。你不是虚伪，只是太擅长适应，以至于忘了哪个才是真正的自己。",
      blindSpot: "你变化太多，让人难以捉摸，也让人难以信任。当对方想要抓住「真正的你」时，你已经换了另一个版本。这不是神秘，这是逃避。",
      soulMatch: "一个能够接受你所有版本、却依然追问「真正的你是谁」的人。需要足够的耐心和洞察力。",
      keywords: ["多变", "适应", "神秘", "灵活", "不确定", "魅力", "逃避"],
      compatibility: 55,
      detailAnalysis: "你是关系中的变色龙，这让你在社交场合游刃有余，但在亲密关系中却可能迷失。真正的亲密需要固定的自我，而你还在寻找。好消息是，找到那个让你愿意停下脚步的人，你就会找到自己。"
    }
  }
  
  if (animal === "owl" && stability > 60 && expression < 40) {
    return {
      title: "剧场的监控者",
      subtitle: "The Theatre Watcher",
      animal: "owl",
      profile: "你是那个坐在控制室里的人，看着所有的剧情发展，分析每一个演员的动机，却很少走上舞台自己演一场。你太懂爱情的逻辑，却忘了爱情需要的是感觉。",
      blindSpot: "你把理性当作保护伞，用分析代替感受。当你忙着解读对方的每一个行为时，你可能错过了最简单的东西——ta只是想要一个拥抱。",
      soulMatch: "一个能够让你放下分析、纯粹去感受的人。需要足够的温暖和耐心，能够融化你的理性防线。",
      keywords: ["理性", "观察", "分析", "克制", "洞察", "距离", "深邃"],
      compatibility: 62,
      detailAnalysis: "你是关系中的心理学家，总能看穿表象下的动机。但有时候，爱情不需要被理解，只需要被感受。试着关掉你的分析大脑，让某个人走进你的感觉世界。不是所有的情感都需要被解释。"
    }
  }
  
  if (animal === "deer" && trust < 45 && intimacy > 55) {
    return {
      title: "林间的逃逸者",
      subtitle: "The Forest Fugitive",
      animal: "deer",
      profile: "你渴望被爱，却又随时准备逃跑。你站在关系的入口，想进去又怕受伤，想离开又舍不得。你的爱是一场拉锯战，对手是你自己。",
      blindSpot: "你总是在「想要靠近」和「想要逃跑」之间摇摆，这种不确定让对方精疲力竭。不是所有的爱都会伤害你，但你的防备本身就是一种伤害。",
      soulMatch: "一个有无限耐心、能够慢慢证明自己不会伤害你的人。需要稳定、温和、不会给你压力的存在。",
      keywords: ["敏感", "警觉", "矛盾", "渴望", "逃避", "脆弱", "温柔"],
      compatibility: 60,
      detailAnalysis: "你的爱像一只惊弓之鸟，一有风吹草动就想飞走。这不是你的错，可能是过去的经历让你学会了自我保护。但请记住：不是所有的亲密都会带来伤害。给自己一个机会，也给那个愿意等你的人一个机会。"
    }
  }
  
  if (autonomy > 55 && intimacy > 55 && stability > 50) {
    return {
      title: "平衡的行者",
      subtitle: "The Balanced Walker",
      animal: "fox",
      profile: "你是少数能够在独立与亲密之间找到平衡的人。你知道什么时候该靠近，什么时候该保持距离。你的爱是成熟的，有分寸的，让人舒服的。",
      blindSpot: "你太「正确」了，有时候反而缺少一点疯狂。爱情不是只有理性的平衡，有时候也需要一点不顾一切的冲动。",
      soulMatch: "一个能够欣赏你的成熟、偶尔又能带你突破舒适圈的人。最好是一个同样独立、但又能给你惊喜的存在。",
      keywords: ["平衡", "成熟", "理性", "独立", "温暖", "分寸", "稳定"],
      compatibility: 78,
      detailAnalysis: "你是关系中的稀缺物种——既不会迷失自己，又能够给予对方足够的爱。这种平衡来之不易，说明你在情感上已经相当成熟。唯一的建议是：偶尔允许自己失控一下，最好的爱情有时需要一点非理性。"
    }
  }
  
  // 默认类型
  return {
    title: "迷雾中的旅人",
    subtitle: "The Misty Traveler",
    animal: animal,
    profile: "你还在探索自己在爱情中的位置，每一段关系都是一次新的发现。你没有固定的模式，这既是你的可能性，也是你的迷茫。",
    blindSpot: "你还不太确定自己要什么，这让你在关系中容易被动——要么被对方定义，要么在不同的可能性之间犹豫不决。",
    soulMatch: "一个能够帮助你认识自己、同时又能接受你的不确定性的人。最好是一个有耐心的探索者。",
    keywords: ["探索", "不确定", "可能性", "成长", "寻找", "变化", "开放"],
    compatibility: 68,
    detailAnalysis: "你是一张还在被书写的纸，这意味着一切皆有可能。不要急于给自己贴标签，也不要急于找到「对的人」。先找到对的自己，对的人自然会出现。"
  }
}

const dimensionLabels: Record<string, string> = {
  openness: "开放性", stability: "情绪稳定", intimacy: "亲密需求",
  autonomy: "独立自主", expression: "情感表达", trust: "信任倾向"
}

export default function LovePersonalityTest() {
  const [stage, setStage] = useState<"intro" | "test" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const scores = useMemo(() => {
    const totalScores = { openness: 0, stability: 0, intimacy: 0, autonomy: 0, expression: 0, trust: 0 }
    Object.entries(answers).forEach(([qId, optionIndex]) => {
      const question = questions.find(q => q.id === Number(qId))
      if (question) {
        const option = question.options[optionIndex]
        Object.entries(option.scores).forEach(([key, value]) => {
          totalScores[key as keyof typeof totalScores] += value
        })
      }
    })
    const maxPossible = 45 * 5
    return Object.fromEntries(
      Object.entries(totalScores).map(([key, value]) => [key, Math.round((value / maxPossible) * 100)])
    ) as Record<string, number>
  }, [answers])

  const radarData = useMemo(() => {
    return Object.entries(scores).map(([key, value]) => ({
      dimension: dimensionLabels[key], value, fullMark: 100,
    }))
  }, [scores])

  const archetype = useMemo(() => getArchetype(scores), [scores])

  const handleSelectOption = useCallback((optionIndex: number) => {
    const question = questions[currentQuestion]
    setAnswers(prev => ({ ...prev, [question.id]: optionIndex }))
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        setStage("result")
      }
    }, 300)
  }, [currentQuestion])

  const handleRestart = useCallback(() => {
    setStage("intro")
    setCurrentQuestion(0)
    setAnswers({})
  }, [])

  const question = questions[currentQuestion]
  const colors = question ? themeColors[question.theme] : themeColors.identity

  const themeColor = "#8a7c6e"

  return (
    <div className="min-h-screen bg-[#d5cec5]">
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-center max-w-md">
              <h1 className="text-4xl font-semibold text-[#4a4540] mb-4 tracking-wider">荒诞剧场</h1>
              <p className="text-[#6b6560] text-lg mb-2">一场关于恋爱人格的自我演出</p>
              <p className="text-[#8a8580] text-sm mb-12">四十五个问题，探索你的物种角色、人格阴影与情感频率</p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStage("test")}
                className="px-12 py-4 bg-[#9a8c7e] text-white rounded-full text-lg tracking-wider transition-all hover:bg-[#8a7c6e] shadow-lg">
                开始演出
              </motion.button>
              <p className="text-[#a09a95] text-xs mt-8">点击选项即视为选择，无法回退</p>
            </motion.div>
          </motion.div>
        )}

        {stage === "test" && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-lg">
              <div className="mb-8">
                <div className="flex justify-between text-sm text-[#8a8580] mb-2">
                  <span>第 {currentQuestion + 1} 题</span>
                  <span>{currentQuestion + 1} / {questions.length}</span>
                </div>
                <div className="h-1 bg-[#c5beb5] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: colors.solid }}
                    initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }} />
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={question.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-2xl text-[#4a4540] mb-8 leading-relaxed text-center">{question.question}</h2>
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <motion.button key={index} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelectOption(index)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${colors.bg} ${colors.border} ${colors.hover} text-[#4a4540]`}>
                        {option.text}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {stage === "result" && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen py-12 px-6">
            <div className="max-w-4xl mx-auto">
              {/* 标题 */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-center mb-10">
                <p className="text-[#8a8580] mb-2">你的恋爱人格是</p>
                <h1 className="text-4xl font-semibold text-[#4a4540] mb-2">{archetype.title}</h1>
                <p className="text-[#6b6560] italic text-lg">{archetype.subtitle}</p>
              </motion.div>

              {/* 动物标识 */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
                className="flex justify-center mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-sm">
                  <p className="text-[#6b6560] text-center">
                    <span className="text-2xl mr-2">{animalNames[archetype.animal]}</span>
                    <span className="text-sm">型人格</span>
                  </p>
                  <p className="text-[#8a8580] text-sm text-center mt-1">{animalDescriptions[archetype.animal]}</p>
                </div>
              </motion.div>

              {/* 剧场侧写 */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm mb-6">
                <h3 className="text-lg font-medium text-[#4a4540] mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#9a8c7e] rounded-full" />
                  剧场侧写
                </h3>
                <p className="text-[#4a4540] text-lg leading-relaxed italic">{archetype.profile}</p>
              </motion.div>

              {/* 关键词云 */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="text-lg font-medium text-[#4a4540] mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#7d8a8c] rounded-full" />
                  人格关键词
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {archetype.keywords.map((keyword, i) => (
                    <motion.span key={keyword} initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                      className="px-4 py-2 rounded-full text-[#4a4540]"
                      style={{ 
                        backgroundColor: `rgba(154, 140, 126, ${0.15 + (i % 3) * 0.1})`,
                        fontSize: `${14 + (i % 3) * 2}px`
                      }}>
                      {keyword}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* 适配度 */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="text-lg font-medium text-[#4a4540] mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#8e9a7d] rounded-full" />
                  关系适配度
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-[#e5e0db] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-[#9a8c7e] to-[#7d8a8c]"
                      initial={{ width: 0 }} animate={{ width: `${archetype.compatibility}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }} />
                  </div>
                  <span className="text-2xl font-medium text-[#4a4540] min-w-[60px]">{archetype.compatibility}%</span>
                </div>
                <p className="text-[#8a8580] text-sm mt-3">
                  {archetype.compatibility >= 70 ? "你在关系中的自我认知相当成熟，已经具备建立健康关系的基础。" :
                   archetype.compatibility >= 55 ? "你对关系有一定的理解，但还有成长空间。每一次恋爱都是认识自己的机会。" :
                   "你可能还在探索自己在关系中的定位。不用急，了解自己是一生的功课。"}
                </p>
              </motion.div>

              {/* 蛛网图 */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="text-lg font-medium text-[#4a4540] mb-4 text-center">六维人格蛛网图</h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#c5beb5" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: "#6b6560", fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#8a8580", fontSize: 10 }} />
                      <Radar name="得分" dataKey="value" stroke={themeColor} fill={themeColor} fillOpacity={0.35} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {Object.entries(scores).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-xs text-[#8a8580] mb-1">{dimensionLabels[key]}</p>
                      <p className="text-2xl font-medium" style={{ color: themeColor }}>{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 恋爱盲点 & 灵魂共振 */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-[#4a4540] mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#a89590] rounded-full" />
                    恋爱盲点
                  </h3>
                  <p className="text-[#6b6560] leading-relaxed">{archetype.blindSpot}</p>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-[#4a4540] mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#998a9a] rounded-full" />
                    灵魂共振
                  </h3>
                  <p className="text-[#6b6560] leading-relaxed">{archetype.soulMatch}</p>
                </motion.div>
              </div>

              {/* 深度分析 */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm mb-8">
                <h3 className="text-lg font-medium text-[#4a4540] mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#8c9199] rounded-full" />
                  深度分析
                </h3>
                <p className="text-[#4a4540] leading-relaxed">{archetype.detailAnalysis}</p>
              </motion.div>

              {/* 重新开始 */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }}
                className="text-center">
                <button onClick={handleRestart}
                  className="px-8 py-3 bg-[#9a8c7e] text-white rounded-full transition-all hover:bg-[#8a7c6e] shadow-lg">
                  重新开始
                </button>
                <p className="text-[#a09a95] text-xs mt-4">每一次测试都是一次新的自我对话</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
