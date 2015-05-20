/*! @2015 Leo Wang. All Rights Reserved */
define('ace/mode/doc_comment_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text_highlight_rules'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text_highlight_rules').TextHighlightRules, s = function () {
            this.$rules = {
                start: [
                    {
                        token: 'comment.doc.tag',
                        regex: '@[\\w\\d_]+'
                    },
                    s.getTagRule(),
                    {
                        defaultToken: 'comment.doc',
                        caseInsensitive: !0
                    }
                ]
            };
        };
    r.inherits(s, i), s.getTagRule = function (e) {
        return {
            token: 'comment.doc.tag.storage.type',
            regex: '\\b(?:TODO|FIXME|XXX|HACK)\\b'
        };
    }, s.getStartRule = function (e) {
        return {
            token: 'comment.doc',
            regex: '\\/\\*(?=\\*)',
            next: e
        };
    }, s.getEndRule = function (e) {
        return {
            token: 'comment.doc',
            regex: '\\*\\/',
            next: e
        };
    }, t.DocCommentHighlightRules = s;
}), define('ace/mode/javascript_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/doc_comment_highlight_rules',
    'ace/mode/text_highlight_rules'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./doc_comment_highlight_rules').DocCommentHighlightRules, s = e('./text_highlight_rules').TextHighlightRules, o = function (e) {
            var t = this.createKeywordMapper({
                    'variable.language': 'Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|Namespace|QName|XML|XMLList|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt|JSON|Math|this|arguments|prototype|window|document',
                    keyword: 'const|yield|import|get|set|break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|__parent__|__count__|escape|unescape|with|__proto__|class|enum|extends|super|export|implements|private|public|interface|package|protected|static',
                    'storage.type': 'const|let|var|function',
                    'constant.language': 'null|Infinity|NaN|undefined',
                    'support.function': 'alert',
                    'constant.language.boolean': 'true|false'
                }, 'identifier'), n = 'case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void', r = '[a-zA-Z\\$_\xA1-\uFFFF][a-zA-Z\\d\\$_\xA1-\uFFFF]*\\b', s = '\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.)';
            this.$rules = {
                no_regex: [
                    {
                        token: 'comment',
                        regex: '\\/\\/',
                        next: 'line_comment'
                    },
                    i.getStartRule('doc-start'),
                    {
                        token: 'comment',
                        regex: /\/\*/,
                        next: 'comment'
                    },
                    {
                        token: 'string',
                        regex: '\'(?=.)',
                        next: 'qstring'
                    },
                    {
                        token: 'string',
                        regex: '"(?=.)',
                        next: 'qqstring'
                    },
                    {
                        token: 'constant.numeric',
                        regex: /0[xX][0-9a-fA-F]+\b/
                    },
                    {
                        token: 'constant.numeric',
                        regex: /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
                    },
                    {
                        token: [
                            'storage.type',
                            'punctuation.operator',
                            'support.function',
                            'punctuation.operator',
                            'entity.name.function',
                            'text',
                            'keyword.operator'
                        ],
                        regex: '(' + r + ')(\\.)(prototype)(\\.)(' + r + ')(\\s*)(=)',
                        next: 'function_arguments'
                    },
                    {
                        token: [
                            'storage.type',
                            'punctuation.operator',
                            'entity.name.function',
                            'text',
                            'keyword.operator',
                            'text',
                            'storage.type',
                            'text',
                            'paren.lparen'
                        ],
                        regex: '(' + r + ')(\\.)(' + r + ')(\\s*)(=)(\\s*)(function)(\\s*)(\\()',
                        next: 'function_arguments'
                    },
                    {
                        token: [
                            'entity.name.function',
                            'text',
                            'keyword.operator',
                            'text',
                            'storage.type',
                            'text',
                            'paren.lparen'
                        ],
                        regex: '(' + r + ')(\\s*)(=)(\\s*)(function)(\\s*)(\\()',
                        next: 'function_arguments'
                    },
                    {
                        token: [
                            'storage.type',
                            'punctuation.operator',
                            'entity.name.function',
                            'text',
                            'keyword.operator',
                            'text',
                            'storage.type',
                            'text',
                            'entity.name.function',
                            'text',
                            'paren.lparen'
                        ],
                        regex: '(' + r + ')(\\.)(' + r + ')(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()',
                        next: 'function_arguments'
                    },
                    {
                        token: [
                            'storage.type',
                            'text',
                            'entity.name.function',
                            'text',
                            'paren.lparen'
                        ],
                        regex: '(function)(\\s+)(' + r + ')(\\s*)(\\()',
                        next: 'function_arguments'
                    },
                    {
                        token: [
                            'entity.name.function',
                            'text',
                            'punctuation.operator',
                            'text',
                            'storage.type',
                            'text',
                            'paren.lparen'
                        ],
                        regex: '(' + r + ')(\\s*)(:)(\\s*)(function)(\\s*)(\\()',
                        next: 'function_arguments'
                    },
                    {
                        token: [
                            'text',
                            'text',
                            'storage.type',
                            'text',
                            'paren.lparen'
                        ],
                        regex: '(:)(\\s*)(function)(\\s*)(\\()',
                        next: 'function_arguments'
                    },
                    {
                        token: 'keyword',
                        regex: '(?:' + n + ')\\b',
                        next: 'start'
                    },
                    {
                        token: [
                            'punctuation.operator',
                            'support.function'
                        ],
                        regex: /(\.)(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/
                    },
                    {
                        token: [
                            'punctuation.operator',
                            'support.function.dom'
                        ],
                        regex: /(\.)(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/
                    },
                    {
                        token: [
                            'punctuation.operator',
                            'support.constant'
                        ],
                        regex: /(\.)(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/
                    },
                    {
                        token: ['support.constant'],
                        regex: /that\b/
                    },
                    {
                        token: [
                            'storage.type',
                            'punctuation.operator',
                            'support.function.firebug'
                        ],
                        regex: /(console)(\.)(warn|info|log|error|time|trace|timeEnd|assert)\b/
                    },
                    {
                        token: t,
                        regex: r
                    },
                    {
                        token: 'keyword.operator',
                        regex: /--|\+\+|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|[!$%&*+\-~\/^]=?/,
                        next: 'start'
                    },
                    {
                        token: 'punctuation.operator',
                        regex: /[?:,;.]/,
                        next: 'start'
                    },
                    {
                        token: 'paren.lparen',
                        regex: /[\[({]/,
                        next: 'start'
                    },
                    {
                        token: 'paren.rparen',
                        regex: /[\])}]/
                    },
                    {
                        token: 'comment',
                        regex: /^#!.*$/
                    }
                ],
                start: [
                    i.getStartRule('doc-start'),
                    {
                        token: 'comment',
                        regex: '\\/\\*',
                        next: 'comment_regex_allowed'
                    },
                    {
                        token: 'comment',
                        regex: '\\/\\/',
                        next: 'line_comment_regex_allowed'
                    },
                    {
                        token: 'string.regexp',
                        regex: '\\/',
                        next: 'regex'
                    },
                    {
                        token: 'text',
                        regex: '\\s+|^$',
                        next: 'start'
                    },
                    {
                        token: 'empty',
                        regex: '',
                        next: 'no_regex'
                    }
                ],
                regex: [
                    {
                        token: 'regexp.keyword.operator',
                        regex: '\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)'
                    },
                    {
                        token: 'string.regexp',
                        regex: '/[sxngimy]*',
                        next: 'no_regex'
                    },
                    {
                        token: 'invalid',
                        regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/
                    },
                    {
                        token: 'constant.language.escape',
                        regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/
                    },
                    {
                        token: 'constant.language.delimiter',
                        regex: /\|/
                    },
                    {
                        token: 'constant.language.escape',
                        regex: /\[\^?/,
                        next: 'regex_character_class'
                    },
                    {
                        token: 'empty',
                        regex: '$',
                        next: 'no_regex'
                    },
                    { defaultToken: 'string.regexp' }
                ],
                regex_character_class: [
                    {
                        token: 'regexp.charclass.keyword.operator',
                        regex: '\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)'
                    },
                    {
                        token: 'constant.language.escape',
                        regex: ']',
                        next: 'regex'
                    },
                    {
                        token: 'constant.language.escape',
                        regex: '-'
                    },
                    {
                        token: 'empty',
                        regex: '$',
                        next: 'no_regex'
                    },
                    { defaultToken: 'string.regexp.charachterclass' }
                ],
                function_arguments: [
                    {
                        token: 'variable.parameter',
                        regex: r
                    },
                    {
                        token: 'punctuation.operator',
                        regex: '[, ]+'
                    },
                    {
                        token: 'punctuation.operator',
                        regex: '$'
                    },
                    {
                        token: 'empty',
                        regex: '',
                        next: 'no_regex'
                    }
                ],
                comment_regex_allowed: [
                    i.getTagRule(),
                    {
                        token: 'comment',
                        regex: '\\*\\/',
                        next: 'start'
                    },
                    {
                        defaultToken: 'comment',
                        caseInsensitive: !0
                    }
                ],
                comment: [
                    i.getTagRule(),
                    {
                        token: 'comment',
                        regex: '\\*\\/',
                        next: 'no_regex'
                    },
                    {
                        defaultToken: 'comment',
                        caseInsensitive: !0
                    }
                ],
                line_comment_regex_allowed: [
                    i.getTagRule(),
                    {
                        token: 'comment',
                        regex: '$|^',
                        next: 'start'
                    },
                    {
                        defaultToken: 'comment',
                        caseInsensitive: !0
                    }
                ],
                line_comment: [
                    i.getTagRule(),
                    {
                        token: 'comment',
                        regex: '$|^',
                        next: 'no_regex'
                    },
                    {
                        defaultToken: 'comment',
                        caseInsensitive: !0
                    }
                ],
                qqstring: [
                    {
                        token: 'constant.language.escape',
                        regex: s
                    },
                    {
                        token: 'string',
                        regex: '\\\\$',
                        next: 'qqstring'
                    },
                    {
                        token: 'string',
                        regex: '"|$',
                        next: 'no_regex'
                    },
                    { defaultToken: 'string' }
                ],
                qstring: [
                    {
                        token: 'constant.language.escape',
                        regex: s
                    },
                    {
                        token: 'string',
                        regex: '\\\\$',
                        next: 'qstring'
                    },
                    {
                        token: 'string',
                        regex: '\'|$',
                        next: 'no_regex'
                    },
                    { defaultToken: 'string' }
                ]
            }, (!e || !e.noES6) && this.$rules.no_regex.unshift({
                regex: '[{}]',
                onMatch: function (e, t, n) {
                    this.next = e == '{' ? this.nextState : '';
                    if (e == '{' && n.length)
                        return n.unshift('start', t), 'paren';
                    if (e == '}' && n.length) {
                        n.shift(), this.next = n.shift();
                        if (this.next.indexOf('string') != -1)
                            return 'paren.quasi.end';
                    }
                    return e == '{' ? 'paren.lparen' : 'paren.rparen';
                },
                nextState: 'start'
            }, {
                token: 'string.quasi.start',
                regex: /`/,
                push: [
                    {
                        token: 'constant.language.escape',
                        regex: s
                    },
                    {
                        token: 'paren.quasi.start',
                        regex: /\${/,
                        push: 'start'
                    },
                    {
                        token: 'string.quasi.end',
                        regex: /`/,
                        next: 'pop'
                    },
                    { defaultToken: 'string.quasi' }
                ]
            }), this.embedRules(i, 'doc-', [i.getEndRule('no_regex')]), this.normalizeRules();
        };
    r.inherits(o, s), t.JavaScriptHighlightRules = o;
}), define('ace/mode/css_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/lib/lang',
    'ace/mode/text_highlight_rules'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('../lib/lang'), s = e('./text_highlight_rules').TextHighlightRules, o = t.supportType = 'animation-fill-mode|alignment-adjust|alignment-baseline|animation-delay|animation-direction|animation-duration|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|animation|appearance|azimuth|backface-visibility|background-attachment|background-break|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|background|baseline-shift|binding|bleed|bookmark-label|bookmark-level|bookmark-state|bookmark-target|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|border|bottom|box-align|box-decoration-break|box-direction|box-flex-group|box-flex|box-lines|box-ordinal-group|box-orient|box-pack|box-shadow|box-sizing|break-after|break-before|break-inside|caption-side|clear|clip|color-profile|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|crop|cue-after|cue-before|cue|cursor|direction|display|dominant-baseline|drop-initial-after-adjust|drop-initial-after-align|drop-initial-before-adjust|drop-initial-before-align|drop-initial-size|drop-initial-value|elevation|empty-cells|fit|fit-position|float-offset|float|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|font|grid-columns|grid-rows|hanging-punctuation|height|hyphenate-after|hyphenate-before|hyphenate-character|hyphenate-lines|hyphenate-resource|hyphens|icon|image-orientation|image-rendering|image-resolution|inline-box-align|left|letter-spacing|line-height|line-stacking-ruby|line-stacking-shift|line-stacking-strategy|line-stacking|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|margin|mark-after|mark-before|mark|marks|marquee-direction|marquee-play-count|marquee-speed|marquee-style|max-height|max-width|min-height|min-width|move-to|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|orphans|outline-color|outline-offset|outline-style|outline-width|outline|overflow-style|overflow-x|overflow-y|overflow|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page-policy|page|pause-after|pause-before|pause|perspective-origin|perspective|phonemes|pitch-range|pitch|play-during|pointer-events|position|presentation-level|punctuation-trim|quotes|rendering-intent|resize|rest-after|rest-before|rest|richness|right|rotation-point|rotation|ruby-align|ruby-overhang|ruby-position|ruby-span|size|speak-header|speak-numeral|speak-punctuation|speak|speech-rate|stress|string-set|table-layout|target-name|target-new|target-position|target|text-align-last|text-align|text-decoration|text-emphasis|text-height|text-indent|text-justify|text-outline|text-shadow|text-transform|text-wrap|top|transform-origin|transform-style|transform|transition-delay|transition-duration|transition-property|transition-timing-function|transition|unicode-bidi|vertical-align|visibility|voice-balance|voice-duration|voice-family|voice-pitch-range|voice-pitch|voice-rate|voice-stress|voice-volume|volume|white-space-collapse|white-space|widows|width|word-break|word-spacing|word-wrap|z-index', u = t.supportFunction = 'rgb|rgba|url|attr|counter|counters', a = t.supportConstant = 'absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|fill|fixed|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero', f = t.supportConstantColor = 'aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow', l = t.supportConstantFonts = 'arial|century|comic|courier|cursive|fantasy|garamond|georgia|helvetica|impact|lucida|symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|serif|monospace', c = t.numRe = '\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))', h = t.pseudoElements = '(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b', p = t.pseudoClasses = '(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b', d = function () {
            var e = this.createKeywordMapper({
                    'support.function': u,
                    'support.constant': a,
                    'support.type': o,
                    'support.constant.color': f,
                    'support.constant.fonts': l
                }, 'text', !0);
            this.$rules = {
                start: [
                    {
                        token: 'comment',
                        regex: '\\/\\*',
                        push: 'comment'
                    },
                    {
                        token: 'paren.lparen',
                        regex: '\\{',
                        push: 'ruleset'
                    },
                    {
                        token: 'string',
                        regex: '@.*?{',
                        push: 'media'
                    },
                    {
                        token: 'keyword',
                        regex: '#[a-z0-9-_]+'
                    },
                    {
                        token: 'variable',
                        regex: '\\.[a-z0-9-_]+'
                    },
                    {
                        token: 'string',
                        regex: ':[a-z0-9-_]+'
                    },
                    {
                        token: 'constant',
                        regex: '[a-z0-9-_]+'
                    },
                    { caseInsensitive: !0 }
                ],
                media: [
                    {
                        token: 'comment',
                        regex: '\\/\\*',
                        push: 'comment'
                    },
                    {
                        token: 'paren.lparen',
                        regex: '\\{',
                        push: 'ruleset'
                    },
                    {
                        token: 'string',
                        regex: '\\}',
                        next: 'pop'
                    },
                    {
                        token: 'keyword',
                        regex: '#[a-z0-9-_]+'
                    },
                    {
                        token: 'variable',
                        regex: '\\.[a-z0-9-_]+'
                    },
                    {
                        token: 'string',
                        regex: ':[a-z0-9-_]+'
                    },
                    {
                        token: 'constant',
                        regex: '[a-z0-9-_]+'
                    },
                    { caseInsensitive: !0 }
                ],
                comment: [
                    {
                        token: 'comment',
                        regex: '\\*\\/',
                        next: 'pop'
                    },
                    { defaultToken: 'comment' }
                ],
                ruleset: [
                    {
                        token: 'paren.rparen',
                        regex: '\\}',
                        next: 'pop'
                    },
                    {
                        token: 'comment',
                        regex: '\\/\\*',
                        push: 'comment'
                    },
                    {
                        token: 'string',
                        regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                    },
                    {
                        token: 'string',
                        regex: '[\'](?:(?:\\\\.)|(?:[^\'\\\\]))*?[\']'
                    },
                    {
                        token: [
                            'constant.numeric',
                            'keyword'
                        ],
                        regex: '(' + c + ')(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vw|%)'
                    },
                    {
                        token: 'constant.numeric',
                        regex: c
                    },
                    {
                        token: 'constant.numeric',
                        regex: '#[a-f0-9]{6}'
                    },
                    {
                        token: 'constant.numeric',
                        regex: '#[a-f0-9]{3}'
                    },
                    {
                        token: [
                            'punctuation',
                            'entity.other.attribute-name.pseudo-element.css'
                        ],
                        regex: h
                    },
                    {
                        token: [
                            'punctuation',
                            'entity.other.attribute-name.pseudo-class.css'
                        ],
                        regex: p
                    },
                    {
                        token: [
                            'support.function',
                            'string',
                            'support.function'
                        ],
                        regex: '(url\\()(.*)(\\))'
                    },
                    {
                        token: e,
                        regex: '\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*'
                    },
                    { caseInsensitive: !0 }
                ]
            }, this.normalizeRules();
        };
    r.inherits(d, s), t.CssHighlightRules = d;
}), define('ace/mode/xml_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text_highlight_rules'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text_highlight_rules').TextHighlightRules, s = function (e) {
            var t = '[_:a-zA-Z\xC0-\uFFFF][-_:.a-zA-Z0-9\xC0-\uFFFF]*';
            this.$rules = {
                start: [
                    {
                        token: 'string.cdata.xml',
                        regex: '<\\!\\[CDATA\\[',
                        next: 'cdata'
                    },
                    {
                        token: [
                            'punctuation.xml-decl.xml',
                            'keyword.xml-decl.xml'
                        ],
                        regex: '(<\\?)(xml)(?=[\\s])',
                        next: 'xml_decl',
                        caseInsensitive: !0
                    },
                    {
                        token: [
                            'punctuation.instruction.xml',
                            'keyword.instruction.xml'
                        ],
                        regex: '(<\\?)(' + t + ')',
                        next: 'processing_instruction'
                    },
                    {
                        token: 'comment.xml',
                        regex: '<\\!--',
                        next: 'comment'
                    },
                    {
                        token: [
                            'xml-pe.doctype.xml',
                            'xml-pe.doctype.xml'
                        ],
                        regex: '(<\\!)(DOCTYPE)(?=[\\s])',
                        next: 'doctype',
                        caseInsensitive: !0
                    },
                    { include: 'tag' },
                    {
                        token: 'text.end-tag-open.xml',
                        regex: '</'
                    },
                    {
                        token: 'text.tag-open.xml',
                        regex: '<'
                    },
                    { include: 'reference' },
                    { defaultToken: 'text.xml' }
                ],
                xml_decl: [
                    {
                        token: 'entity.other.attribute-name.decl-attribute-name.xml',
                        regex: '(?:' + t + ':)?' + t + ''
                    },
                    {
                        token: 'keyword.operator.decl-attribute-equals.xml',
                        regex: '='
                    },
                    { include: 'whitespace' },
                    { include: 'string' },
                    {
                        token: 'punctuation.xml-decl.xml',
                        regex: '\\?>',
                        next: 'start'
                    }
                ],
                processing_instruction: [
                    {
                        token: 'punctuation.instruction.xml',
                        regex: '\\?>',
                        next: 'start'
                    },
                    { defaultToken: 'instruction.xml' }
                ],
                doctype: [
                    { include: 'whitespace' },
                    { include: 'string' },
                    {
                        token: 'xml-pe.doctype.xml',
                        regex: '>',
                        next: 'start'
                    },
                    {
                        token: 'xml-pe.xml',
                        regex: '[-_a-zA-Z0-9:]+'
                    },
                    {
                        token: 'punctuation.int-subset',
                        regex: '\\[',
                        push: 'int_subset'
                    }
                ],
                int_subset: [
                    {
                        token: 'text.xml',
                        regex: '\\s+'
                    },
                    {
                        token: 'punctuation.int-subset.xml',
                        regex: ']',
                        next: 'pop'
                    },
                    {
                        token: [
                            'punctuation.markup-decl.xml',
                            'keyword.markup-decl.xml'
                        ],
                        regex: '(<\\!)(' + t + ')',
                        push: [
                            {
                                token: 'text',
                                regex: '\\s+'
                            },
                            {
                                token: 'punctuation.markup-decl.xml',
                                regex: '>',
                                next: 'pop'
                            },
                            { include: 'string' }
                        ]
                    }
                ],
                cdata: [
                    {
                        token: 'string.cdata.xml',
                        regex: '\\]\\]>',
                        next: 'start'
                    },
                    {
                        token: 'text.xml',
                        regex: '\\s+'
                    },
                    {
                        token: 'text.xml',
                        regex: '(?:[^\\]]|\\](?!\\]>))+'
                    }
                ],
                comment: [
                    {
                        token: 'comment.xml',
                        regex: '-->',
                        next: 'start'
                    },
                    { defaultToken: 'comment.xml' }
                ],
                reference: [{
                        token: 'constant.language.escape.reference.xml',
                        regex: '(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)'
                    }],
                attr_reference: [{
                        token: 'constant.language.escape.reference.attribute-value.xml',
                        regex: '(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)'
                    }],
                tag: [{
                        token: [
                            'meta.tag.punctuation.tag-open.xml',
                            'meta.tag.punctuation.end-tag-open.xml',
                            'meta.tag.tag-name.xml'
                        ],
                        regex: '(?:(<)|(</))((?:' + t + ':)?' + t + ')',
                        next: [
                            { include: 'attributes' },
                            {
                                token: 'meta.tag.punctuation.tag-close.xml',
                                regex: '/?>',
                                next: 'start'
                            }
                        ]
                    }],
                tag_whitespace: [{
                        token: 'text.tag-whitespace.xml',
                        regex: '\\s+'
                    }],
                whitespace: [{
                        token: 'text.whitespace.xml',
                        regex: '\\s+'
                    }],
                string: [
                    {
                        token: 'string.xml',
                        regex: '\'',
                        push: [
                            {
                                token: 'string.xml',
                                regex: '\'',
                                next: 'pop'
                            },
                            { defaultToken: 'string.xml' }
                        ]
                    },
                    {
                        token: 'string.xml',
                        regex: '"',
                        push: [
                            {
                                token: 'string.xml',
                                regex: '"',
                                next: 'pop'
                            },
                            { defaultToken: 'string.xml' }
                        ]
                    }
                ],
                attributes: [
                    {
                        token: 'entity.other.attribute-name.xml',
                        regex: '(?:' + t + ':)?' + t + ''
                    },
                    {
                        token: 'keyword.operator.attribute-equals.xml',
                        regex: '='
                    },
                    { include: 'tag_whitespace' },
                    { include: 'attribute_value' }
                ],
                attribute_value: [
                    {
                        token: 'string.attribute-value.xml',
                        regex: '\'',
                        push: [
                            {
                                token: 'string.attribute-value.xml',
                                regex: '\'',
                                next: 'pop'
                            },
                            { include: 'attr_reference' },
                            { defaultToken: 'string.attribute-value.xml' }
                        ]
                    },
                    {
                        token: 'string.attribute-value.xml',
                        regex: '"',
                        push: [
                            {
                                token: 'string.attribute-value.xml',
                                regex: '"',
                                next: 'pop'
                            },
                            { include: 'attr_reference' },
                            { defaultToken: 'string.attribute-value.xml' }
                        ]
                    }
                ]
            }, this.constructor === s && this.normalizeRules();
        };
    (function () {
        this.embedTagRules = function (e, t, n) {
            this.$rules.tag.unshift({
                token: [
                    'meta.tag.punctuation.tag-open.xml',
                    'meta.tag.' + n + '.tag-name.xml'
                ],
                regex: '(<)(' + n + '(?=\\s|>|$))',
                next: [
                    { include: 'attributes' },
                    {
                        token: 'meta.tag.punctuation.tag-close.xml',
                        regex: '/?>',
                        next: t + 'start'
                    }
                ]
            }), this.$rules[n + '-end'] = [
                { include: 'attributes' },
                {
                    token: 'meta.tag.punctuation.tag-close.xml',
                    regex: '/?>',
                    next: 'start',
                    onMatch: function (e, t, n) {
                        return n.splice(0), this.token;
                    }
                }
            ], this.embedRules(e, t, [
                {
                    token: [
                        'meta.tag.punctuation.end-tag-open.xml',
                        'meta.tag.' + n + '.tag-name.xml'
                    ],
                    regex: '(</)(' + n + '(?=\\s|>|$))',
                    next: n + '-end'
                },
                {
                    token: 'string.cdata.xml',
                    regex: '<\\!\\[CDATA\\['
                },
                {
                    token: 'string.cdata.xml',
                    regex: '\\]\\]>'
                }
            ]);
        };
    }.call(i.prototype), r.inherits(s, i), t.XmlHighlightRules = s);
}), define('ace/mode/html_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/lib/lang',
    'ace/mode/css_highlight_rules',
    'ace/mode/javascript_highlight_rules',
    'ace/mode/xml_highlight_rules'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('../lib/lang'), s = e('./css_highlight_rules').CssHighlightRules, o = e('./javascript_highlight_rules').JavaScriptHighlightRules, u = e('./xml_highlight_rules').XmlHighlightRules, a = i.createMap({
            a: 'anchor',
            button: 'form',
            form: 'form',
            img: 'image',
            input: 'form',
            label: 'form',
            option: 'form',
            script: 'script',
            select: 'form',
            textarea: 'form',
            style: 'style',
            table: 'table',
            tbody: 'table',
            td: 'table',
            tfoot: 'table',
            th: 'table',
            tr: 'table'
        }), f = function () {
            u.call(this), this.addRules({
                attributes: [
                    { include: 'tag_whitespace' },
                    {
                        token: 'entity.other.attribute-name.xml',
                        regex: '[-_a-zA-Z0-9:.]+'
                    },
                    {
                        token: 'keyword.operator.attribute-equals.xml',
                        regex: '=',
                        push: [
                            { include: 'tag_whitespace' },
                            {
                                token: 'string.unquoted.attribute-value.html',
                                regex: '[^<>=\'"`\\s]+',
                                next: 'pop'
                            },
                            {
                                token: 'empty',
                                regex: '',
                                next: 'pop'
                            }
                        ]
                    },
                    { include: 'attribute_value' }
                ],
                tag: [{
                        token: function (e, t) {
                            var n = a[t];
                            return [
                                'meta.tag.punctuation.' + (e == '<' ? '' : 'end-') + 'tag-open.xml',
                                'meta.tag' + (n ? '.' + n : '') + '.tag-name.xml'
                            ];
                        },
                        regex: '(</?)([-_a-zA-Z0-9:.]+)',
                        next: 'tag_stuff'
                    }],
                tag_stuff: [
                    { include: 'attributes' },
                    {
                        token: 'meta.tag.punctuation.tag-close.xml',
                        regex: '/?>',
                        next: 'start'
                    }
                ]
            }), this.embedTagRules(s, 'css-', 'style'), this.embedTagRules(o, 'js-', 'script'), this.constructor === f && this.normalizeRules();
        };
    r.inherits(f, u), t.HtmlHighlightRules = f;
}), define('ace/mode/markdown_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/lib/lang',
    'ace/mode/text_highlight_rules',
    'ace/mode/javascript_highlight_rules',
    'ace/mode/xml_highlight_rules',
    'ace/mode/html_highlight_rules',
    'ace/mode/css_highlight_rules'
], function (e, t, n) {
    'use strict';
    function c(e, t) {
        return {
            token: 'support.function',
            regex: '^\\s*```' + e + '\\s*$',
            push: t + 'start'
        };
    }
    var r = e('../lib/oop'), i = e('../lib/lang'), s = e('./text_highlight_rules').TextHighlightRules, o = e('./javascript_highlight_rules').JavaScriptHighlightRules, u = e('./xml_highlight_rules').XmlHighlightRules, a = e('./html_highlight_rules').HtmlHighlightRules, f = e('./css_highlight_rules').CssHighlightRules, l = function (e) {
            return '(?:[^' + i.escapeRegExp(e) + '\\\\]|\\\\.)*';
        }, h = function () {
            a.call(this), this.$rules.start.unshift({
                token: 'empty_line',
                regex: '^$',
                next: 'allowBlock'
            }, {
                token: 'markup.heading.1',
                regex: '^=+(?=\\s*$)'
            }, {
                token: 'markup.heading.2',
                regex: '^\\-+(?=\\s*$)'
            }, {
                token: function (e) {
                    return 'markup.heading.' + e.length;
                },
                regex: /^#{1,6}(?=\s*[^ #]|\s+#.)/,
                next: 'header'
            }, c('(?:javascript|js)', 'jscode-'), c('xml', 'xmlcode-'), c('html', 'htmlcode-'), c('css', 'csscode-'), {
                token: 'support.function',
                regex: '^\\s*```\\s*\\S*(?:{.*?\\})?\\s*$',
                next: 'githubblock'
            }, {
                token: 'string.blockquote',
                regex: '^\\s*>\\s*(?:[*+-]|\\d+\\.)?\\s+',
                next: 'blockquote'
            }, {
                token: 'constant',
                regex: '^ {0,2}(?:(?: ?\\* ?){3,}|(?: ?\\- ?){3,}|(?: ?\\_ ?){3,})\\s*$',
                next: 'allowBlock'
            }, {
                token: 'markup.list',
                regex: '^\\s{0,3}(?:[*+-]|\\d+\\.)\\s+',
                next: 'listblock-start'
            }, { include: 'basic' }), this.addRules({
                basic: [
                    {
                        token: 'constant.language.escape',
                        regex: /\\[\\`*_{}\[\]()#+\-.!]/
                    },
                    {
                        token: 'support.function',
                        regex: '(`+)(.*?[^`])(\\1)'
                    },
                    {
                        token: [
                            'text',
                            'constant',
                            'text',
                            'url',
                            'string',
                            'text'
                        ],
                        regex: '^([ ]{0,3}\\[)([^\\]]+)(\\]:\\s*)([^ ]+)(\\s*(?:["][^"]+["])?(\\s*))$'
                    },
                    {
                        token: [
                            'text',
                            'string',
                            'text',
                            'constant',
                            'text'
                        ],
                        regex: '(\\[)(' + l(']') + ')(\\]s*\\[)(' + l(']') + ')(\\])'
                    },
                    {
                        token: [
                            'text',
                            'string',
                            'text',
                            'markup.underline',
                            'string',
                            'text'
                        ],
                        regex: '(\\[)(' + l(']') + ')(\\]\\()' + '((?:[^\\)\\s\\\\]|\\\\.|\\s(?=[^"]))*)' + '(\\s*"' + l('"') + '"\\s*)?' + '(\\))'
                    },
                    {
                        token: 'string.strong',
                        regex: '([*]{2}|[_]{2}(?=\\S))(.*?\\S[*_]*)(\\1)'
                    },
                    {
                        token: 'string.emphasis',
                        regex: '([*]|[_](?=\\S))(.*?\\S[*_]*)(\\1)'
                    },
                    {
                        token: [
                            'text',
                            'url',
                            'text'
                        ],
                        regex: '(<)((?:https?|ftp|dict):[^\'">\\s]+|(?:mailto:)?[-.\\w]+\\@[-a-z0-9]+(?:\\.[-a-z0-9]+)*\\.[a-z]+)(>)'
                    }
                ],
                allowBlock: [
                    {
                        token: 'support.function',
                        regex: '^ {4}.+',
                        next: 'allowBlock'
                    },
                    {
                        token: 'empty',
                        regex: '',
                        next: 'start'
                    }
                ],
                header: [
                    {
                        regex: '$',
                        next: 'start'
                    },
                    { include: 'basic' },
                    { defaultToken: 'heading' }
                ],
                'listblock-start': [{
                        token: 'support.variable',
                        regex: /(?:\[[ x]\])?/,
                        next: 'listblock'
                    }],
                listblock: [
                    {
                        token: 'empty_line',
                        regex: '^$',
                        next: 'start'
                    },
                    {
                        token: 'markup.list',
                        regex: '^\\s{0,3}(?:[*+-]|\\d+\\.)\\s+',
                        next: 'listblock-start'
                    },
                    {
                        include: 'basic',
                        noEscape: !0
                    },
                    {
                        token: 'support.function',
                        regex: '^\\s*```\\s*[a-zA-Z]*(?:{.*?\\})?\\s*$',
                        next: 'githubblock'
                    },
                    { defaultToken: 'list' }
                ],
                blockquote: [
                    {
                        token: 'empty_line',
                        regex: '^\\s*$',
                        next: 'start'
                    },
                    {
                        token: 'string.blockquote',
                        regex: '^\\s*>\\s*(?:[*+-]|\\d+\\.)?\\s+',
                        next: 'blockquote'
                    },
                    {
                        include: 'basic',
                        noEscape: !0
                    },
                    { defaultToken: 'string.blockquote' }
                ],
                githubblock: [
                    {
                        token: 'support.function',
                        regex: '^\\s*```',
                        next: 'start'
                    },
                    {
                        token: 'support.function',
                        regex: '.+'
                    }
                ]
            }), this.embedRules(o, 'jscode-', [{
                    token: 'support.function',
                    regex: '^\\s*```',
                    next: 'pop'
                }]), this.embedRules(a, 'htmlcode-', [{
                    token: 'support.function',
                    regex: '^\\s*```',
                    next: 'pop'
                }]), this.embedRules(f, 'csscode-', [{
                    token: 'support.function',
                    regex: '^\\s*```',
                    next: 'pop'
                }]), this.embedRules(u, 'xmlcode-', [{
                    token: 'support.function',
                    regex: '^\\s*```',
                    next: 'pop'
                }]), this.normalizeRules();
        };
    r.inherits(h, s), t.MarkdownHighlightRules = h;
}), define('ace/mode/mask_highlight_rules', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/lib/lang',
    'ace/mode/text_highlight_rules',
    'ace/mode/javascript_highlight_rules',
    'ace/mode/css_highlight_rules',
    'ace/mode/markdown_highlight_rules',
    'ace/mode/html_highlight_rules'
], function (e, t, n) {
    'use strict';
    function N() {
        function t(e, t, n) {
            var r = 'js-' + e + '-', i = e === 'block' ? ['start'] : [
                    'start',
                    'no_regex'
                ];
            s(o, r, t, i, n);
        }
        function n() {
            s(u, 'css-block-', /\}/);
        }
        function r() {
            s(a, 'md-multiline-', /("""|''')/, []);
        }
        function i() {
            s(f, 'html-multiline-', /("""|''')/);
        }
        function s(t, n, r, i, s) {
            var o = 'pop', u = i || ['start'];
            u.length === 0 && (u = null), /block|multiline/.test(n) && (o = n + 'end', e.$rules[o] = [k('empty', '', 'start')]), e.embedRules(t, n, [k(s || w, r, o)], u, u == null ? !0 : !1);
        }
        this.$rules = {
            start: [
                k('comment', '\\/\\/.*$'),
                k('comment', '\\/\\*', [
                    k('comment', '.*?\\*\\/', 'start'),
                    k('comment', '.+')
                ]),
                C.string('\'\'\''),
                C.string('"""'),
                C.string('"'),
                C.string('\''),
                C.syntax(/(markdown|md)\b/, 'md-multiline', 'multiline'),
                C.syntax(/html\b/, 'html-multiline', 'multiline'),
                C.syntax(/(slot|event)\b/, 'js-block', 'block'),
                C.syntax(/style\b/, 'css-block', 'block'),
                C.syntax(/var\b/, 'js-statement', 'attr'),
                C.tag(),
                k(b, '[[({>]'),
                k(w, '[\\])};]', 'start'),
                { caseInsensitive: !0 }
            ]
        };
        var e = this;
        t('interpolation', /\]/, w + '.' + g), t('statement', /\)|}|;/), t('block', /\}/), n(), r(), i(), this.normalizeRules();
    }
    function k(e, t, n) {
        var r, i, s;
        return arguments.length === 4 ? (r = n, i = arguments[3]) : typeof n == 'string' ? i = n : r = n, typeof e == 'function' && (s = e, e = 'empty'), {
            token: e,
            regex: t,
            push: r,
            next: i,
            onMatch: s
        };
    }
    t.MaskHighlightRules = N;
    var r = e('../lib/oop'), i = e('../lib/lang'), s = e('./text_highlight_rules').TextHighlightRules, o = e('./javascript_highlight_rules').JavaScriptHighlightRules, u = e('./css_highlight_rules').CssHighlightRules, a = e('./markdown_highlight_rules').MarkdownHighlightRules, f = e('./html_highlight_rules').HtmlHighlightRules, l = 'keyword.support.constant.language', c = 'support.function.markup.bold', h = 'keyword', p = 'constant.language', d = 'keyword.control.markup.italic', v = 'support.variable.class', m = 'keyword.operator', g = 'markup.italic', y = 'markup.bold', b = 'paren.lparen', w = 'paren.rparen', E, S, x, T;
    (function () {
        E = i.arrayToMap('log'.split('|')), x = i.arrayToMap(':dualbind|:bind|:import|slot|event|style|html|markdown|md'.split('|')), S = i.arrayToMap('debugger|define|var|if|each|for|of|else|switch|case|with|visible|+if|+each|+for|+switch|+with|+visible|include|import'.split('|')), T = i.arrayToMap('a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|u|ul|var|video|wbr|xmp'.split('|'));
    }(), r.inherits(N, s));
    var C = {
            string: function (e, t) {
                var n = k('string.start', e, [
                        k(b + '.' + g, /~\[/, C.interpolation()),
                        k('string.end', e, 'pop'),
                        { defaultToken: 'string' }
                    ], t);
                if (e.length === 1) {
                    var r = k('string.escape', '\\\\' + e);
                    n.push.unshift(r);
                }
                return n;
            },
            interpolation: function () {
                return [
                    k(d, /\s*\w*\s*:/),
                    'js-interpolation-start'
                ];
            },
            tagHead: function (e) {
                return k(v, e, [
                    k(v, /[\w\-_]+/),
                    k(b + '.' + g, /~\[/, C.interpolation()),
                    C.goUp()
                ]);
            },
            tag: function () {
                return {
                    token: 'tag',
                    onMatch: function (e) {
                        return void 0 !== S[e] ? h : void 0 !== x[e] ? p : void 0 !== E[e] ? 'support.function' : void 0 !== T[e.toLowerCase()] ? l : c;
                    },
                    regex: /([@\w\-_:+]+)|((^|\s)(?=\s*(\.|#)))/,
                    push: [
                        C.tagHead(/\./),
                        C.tagHead(/\#/),
                        C.expression(),
                        C.attribute(),
                        k(b, /[;>{]/, 'pop')
                    ]
                };
            },
            syntax: function (e, t, n) {
                return {
                    token: p,
                    regex: e,
                    push: {
                        attr: [
                            t + '-start',
                            k(m, /;/, 'start')
                        ],
                        multiline: [
                            C.tagHead(/\./),
                            C.tagHead(/\#/),
                            C.attribute(),
                            C.expression(),
                            k(b, /[>\{]/),
                            k(m, /;/, 'start'),
                            k(b, /'''|"""/, [t + '-start'])
                        ],
                        block: [
                            C.tagHead(/\./),
                            C.tagHead(/\#/),
                            C.attribute(),
                            C.expression(),
                            k(b, /\{/, [t + '-start'])
                        ]
                    }[n]
                };
            },
            attribute: function () {
                return k(function (e) {
                    return /^x\-/.test(e) ? v + '.' + y : v;
                }, /[\w_-]+/, [
                    k(m, /\s*=\s*/, [
                        C.string('"'),
                        C.string('\''),
                        C.word(),
                        C.goUp()
                    ]),
                    C.goUp()
                ]);
            },
            expression: function () {
                return k(b, /\(/, ['js-statement-start']);
            },
            word: function () {
                return k('string', /[\w-_]+/);
            },
            goUp: function () {
                return k('text', '', 'pop');
            },
            goStart: function () {
                return k('text', '', 'start');
            }
        };
}), define('ace/mode/matching_brace_outdent', [
    'require',
    'exports',
    'module',
    'ace/range'
], function (e, t, n) {
    'use strict';
    var r = e('../range').Range, i = function () {
        };
    (function () {
        this.checkOutdent = function (e, t) {
            return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1;
        }, this.autoOutdent = function (e, t) {
            var n = e.getLine(t), i = n.match(/^(\s*\})/);
            if (!i)
                return 0;
            var s = i[1].length, o = e.findMatchingBracket({
                    row: t,
                    column: s
                });
            if (!o || o.row == t)
                return 0;
            var u = this.$getIndent(e.getLine(o.row));
            e.replace(new r(t, 0, t, s - 1), u);
        }, this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
        };
    }.call(i.prototype), t.MatchingBraceOutdent = i);
}), define('ace/mode/behaviour/cstyle', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/behaviour',
    'ace/token_iterator',
    'ace/lib/lang'
], function (e, t, n) {
    'use strict';
    var r = e('../../lib/oop'), i = e('../behaviour').Behaviour, s = e('../../token_iterator').TokenIterator, o = e('../../lib/lang'), u = [
            'text',
            'paren.rparen',
            'punctuation.operator'
        ], a = [
            'text',
            'paren.rparen',
            'punctuation.operator',
            'comment'
        ], f, l = {}, c = function (e) {
            var t = -1;
            e.multiSelect && (t = e.selection.index, l.rangeCount != e.multiSelect.rangeCount && (l = { rangeCount: e.multiSelect.rangeCount }));
            if (l[t])
                return f = l[t];
            f = l[t] = {
                autoInsertedBrackets: 0,
                autoInsertedRow: -1,
                autoInsertedLineEnd: '',
                maybeInsertedBrackets: 0,
                maybeInsertedRow: -1,
                maybeInsertedLineStart: '',
                maybeInsertedLineEnd: ''
            };
        }, h = function (e, t, n, r) {
            var i = e.end.row - e.start.row;
            return {
                text: n + t + r,
                selection: [
                    0,
                    e.start.column + 1,
                    i,
                    e.end.column + (i ? 0 : 1)
                ]
            };
        }, p = function () {
            this.add('braces', 'insertion', function (e, t, n, r, i) {
                var s = n.getCursorPosition(), u = r.doc.getLine(s.row);
                if (i == '{') {
                    c(n);
                    var a = n.getSelectionRange(), l = r.doc.getTextRange(a);
                    if (l !== '' && l !== '{' && n.getWrapBehavioursEnabled())
                        return h(a, l, '{', '}');
                    if (p.isSaneInsertion(n, r))
                        return /[\]\}\)]/.test(u[s.column]) || n.inMultiSelectMode ? (p.recordAutoInsert(n, r, '}'), {
                            text: '{}',
                            selection: [
                                1,
                                1
                            ]
                        }) : (p.recordMaybeInsert(n, r, '{'), {
                            text: '{',
                            selection: [
                                1,
                                1
                            ]
                        });
                } else if (i == '}') {
                    c(n);
                    var d = u.substring(s.column, s.column + 1);
                    if (d == '}') {
                        var v = r.$findOpeningBracket('}', {
                                column: s.column + 1,
                                row: s.row
                            });
                        if (v !== null && p.isAutoInsertedClosing(s, u, i))
                            return p.popAutoInsertedClosing(), {
                                text: '',
                                selection: [
                                    1,
                                    1
                                ]
                            };
                    }
                } else {
                    if (i == '\n' || i == '\r\n') {
                        c(n);
                        var m = '';
                        p.isMaybeInsertedClosing(s, u) && (m = o.stringRepeat('}', f.maybeInsertedBrackets), p.clearMaybeInsertedClosing());
                        var d = u.substring(s.column, s.column + 1);
                        if (d === '}') {
                            var g = r.findMatchingBracket({
                                    row: s.row,
                                    column: s.column + 1
                                }, '}');
                            if (!g)
                                return null;
                            var y = this.$getIndent(r.getLine(g.row));
                        } else {
                            if (!m) {
                                p.clearMaybeInsertedClosing();
                                return;
                            }
                            var y = this.$getIndent(u);
                        }
                        var b = y + r.getTabString();
                        return {
                            text: '\n' + b + '\n' + y + m,
                            selection: [
                                1,
                                b.length,
                                1,
                                b.length
                            ]
                        };
                    }
                    p.clearMaybeInsertedClosing();
                }
            }), this.add('braces', 'deletion', function (e, t, n, r, i) {
                var s = r.doc.getTextRange(i);
                if (!i.isMultiLine() && s == '{') {
                    c(n);
                    var o = r.doc.getLine(i.start.row), u = o.substring(i.end.column, i.end.column + 1);
                    if (u == '}')
                        return i.end.column++, i;
                    f.maybeInsertedBrackets--;
                }
            }), this.add('parens', 'insertion', function (e, t, n, r, i) {
                if (i == '(') {
                    c(n);
                    var s = n.getSelectionRange(), o = r.doc.getTextRange(s);
                    if (o !== '' && n.getWrapBehavioursEnabled())
                        return h(s, o, '(', ')');
                    if (p.isSaneInsertion(n, r))
                        return p.recordAutoInsert(n, r, ')'), {
                            text: '()',
                            selection: [
                                1,
                                1
                            ]
                        };
                } else if (i == ')') {
                    c(n);
                    var u = n.getCursorPosition(), a = r.doc.getLine(u.row), f = a.substring(u.column, u.column + 1);
                    if (f == ')') {
                        var l = r.$findOpeningBracket(')', {
                                column: u.column + 1,
                                row: u.row
                            });
                        if (l !== null && p.isAutoInsertedClosing(u, a, i))
                            return p.popAutoInsertedClosing(), {
                                text: '',
                                selection: [
                                    1,
                                    1
                                ]
                            };
                    }
                }
            }), this.add('parens', 'deletion', function (e, t, n, r, i) {
                var s = r.doc.getTextRange(i);
                if (!i.isMultiLine() && s == '(') {
                    c(n);
                    var o = r.doc.getLine(i.start.row), u = o.substring(i.start.column + 1, i.start.column + 2);
                    if (u == ')')
                        return i.end.column++, i;
                }
            }), this.add('brackets', 'insertion', function (e, t, n, r, i) {
                if (i == '[') {
                    c(n);
                    var s = n.getSelectionRange(), o = r.doc.getTextRange(s);
                    if (o !== '' && n.getWrapBehavioursEnabled())
                        return h(s, o, '[', ']');
                    if (p.isSaneInsertion(n, r))
                        return p.recordAutoInsert(n, r, ']'), {
                            text: '[]',
                            selection: [
                                1,
                                1
                            ]
                        };
                } else if (i == ']') {
                    c(n);
                    var u = n.getCursorPosition(), a = r.doc.getLine(u.row), f = a.substring(u.column, u.column + 1);
                    if (f == ']') {
                        var l = r.$findOpeningBracket(']', {
                                column: u.column + 1,
                                row: u.row
                            });
                        if (l !== null && p.isAutoInsertedClosing(u, a, i))
                            return p.popAutoInsertedClosing(), {
                                text: '',
                                selection: [
                                    1,
                                    1
                                ]
                            };
                    }
                }
            }), this.add('brackets', 'deletion', function (e, t, n, r, i) {
                var s = r.doc.getTextRange(i);
                if (!i.isMultiLine() && s == '[') {
                    c(n);
                    var o = r.doc.getLine(i.start.row), u = o.substring(i.start.column + 1, i.start.column + 2);
                    if (u == ']')
                        return i.end.column++, i;
                }
            }), this.add('string_dquotes', 'insertion', function (e, t, n, r, i) {
                if (i == '"' || i == '\'') {
                    c(n);
                    var s = i, o = n.getSelectionRange(), u = r.doc.getTextRange(o);
                    if (u !== '' && u !== '\'' && u != '"' && n.getWrapBehavioursEnabled())
                        return h(o, u, s, s);
                    if (!u) {
                        var a = n.getCursorPosition(), f = r.doc.getLine(a.row), l = f.substring(a.column - 1, a.column), p = f.substring(a.column, a.column + 1), d = r.getTokenAt(a.row, a.column), v = r.getTokenAt(a.row, a.column + 1);
                        if (l == '\\' && d && /escape/.test(d.type))
                            return null;
                        var m = d && /string/.test(d.type), g = !v || /string/.test(v.type), y;
                        if (p == s)
                            y = m !== g;
                        else {
                            if (m && !g)
                                return null;
                            if (m && g)
                                return null;
                            var b = r.$mode.tokenRe;
                            b.lastIndex = 0;
                            var w = b.test(l);
                            b.lastIndex = 0;
                            var E = b.test(l);
                            if (w || E)
                                return null;
                            if (p && !/[\s;,.})\]\\]/.test(p))
                                return null;
                            y = !0;
                        }
                        return {
                            text: y ? s + s : '',
                            selection: [
                                1,
                                1
                            ]
                        };
                    }
                }
            }), this.add('string_dquotes', 'deletion', function (e, t, n, r, i) {
                var s = r.doc.getTextRange(i);
                if (!i.isMultiLine() && (s == '"' || s == '\'')) {
                    c(n);
                    var o = r.doc.getLine(i.start.row), u = o.substring(i.start.column + 1, i.start.column + 2);
                    if (u == s)
                        return i.end.column++, i;
                }
            });
        };
    p.isSaneInsertion = function (e, t) {
        var n = e.getCursorPosition(), r = new s(t, n.row, n.column);
        if (!this.$matchTokenType(r.getCurrentToken() || 'text', u)) {
            var i = new s(t, n.row, n.column + 1);
            if (!this.$matchTokenType(i.getCurrentToken() || 'text', u))
                return !1;
        }
        return r.stepForward(), r.getCurrentTokenRow() !== n.row || this.$matchTokenType(r.getCurrentToken() || 'text', a);
    }, p.$matchTokenType = function (e, t) {
        return t.indexOf(e.type || e) > -1;
    }, p.recordAutoInsert = function (e, t, n) {
        var r = e.getCursorPosition(), i = t.doc.getLine(r.row);
        this.isAutoInsertedClosing(r, i, f.autoInsertedLineEnd[0]) || (f.autoInsertedBrackets = 0), f.autoInsertedRow = r.row, f.autoInsertedLineEnd = n + i.substr(r.column), f.autoInsertedBrackets++;
    }, p.recordMaybeInsert = function (e, t, n) {
        var r = e.getCursorPosition(), i = t.doc.getLine(r.row);
        this.isMaybeInsertedClosing(r, i) || (f.maybeInsertedBrackets = 0), f.maybeInsertedRow = r.row, f.maybeInsertedLineStart = i.substr(0, r.column) + n, f.maybeInsertedLineEnd = i.substr(r.column), f.maybeInsertedBrackets++;
    }, p.isAutoInsertedClosing = function (e, t, n) {
        return f.autoInsertedBrackets > 0 && e.row === f.autoInsertedRow && n === f.autoInsertedLineEnd[0] && t.substr(e.column) === f.autoInsertedLineEnd;
    }, p.isMaybeInsertedClosing = function (e, t) {
        return f.maybeInsertedBrackets > 0 && e.row === f.maybeInsertedRow && t.substr(e.column) === f.maybeInsertedLineEnd && t.substr(0, e.column) == f.maybeInsertedLineStart;
    }, p.popAutoInsertedClosing = function () {
        f.autoInsertedLineEnd = f.autoInsertedLineEnd.substr(1), f.autoInsertedBrackets--;
    }, p.clearMaybeInsertedClosing = function () {
        f && (f.maybeInsertedBrackets = 0, f.maybeInsertedRow = -1);
    }, r.inherits(p, i), t.CstyleBehaviour = p;
}), define('ace/mode/behaviour/css', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/behaviour',
    'ace/mode/behaviour/cstyle',
    'ace/token_iterator'
], function (e, t, n) {
    'use strict';
    var r = e('../../lib/oop'), i = e('../behaviour').Behaviour, s = e('./cstyle').CstyleBehaviour, o = e('../../token_iterator').TokenIterator, u = function () {
            this.inherit(s), this.add('colon', 'insertion', function (e, t, n, r, i) {
                if (i === ':') {
                    var s = n.getCursorPosition(), u = new o(r, s.row, s.column), a = u.getCurrentToken();
                    a && a.value.match(/\s+/) && (a = u.stepBackward());
                    if (a && a.type === 'support.type') {
                        var f = r.doc.getLine(s.row), l = f.substring(s.column, s.column + 1);
                        if (l === ':')
                            return {
                                text: '',
                                selection: [
                                    1,
                                    1
                                ]
                            };
                        if (!f.substring(s.column).match(/^\s*;/))
                            return {
                                text: ':;',
                                selection: [
                                    1,
                                    1
                                ]
                            };
                    }
                }
            }), this.add('colon', 'deletion', function (e, t, n, r, i) {
                var s = r.doc.getTextRange(i);
                if (!i.isMultiLine() && s === ':') {
                    var u = n.getCursorPosition(), a = new o(r, u.row, u.column), f = a.getCurrentToken();
                    f && f.value.match(/\s+/) && (f = a.stepBackward());
                    if (f && f.type === 'support.type') {
                        var l = r.doc.getLine(i.start.row), c = l.substring(i.end.column, i.end.column + 1);
                        if (c === ';')
                            return i.end.column++, i;
                    }
                }
            }), this.add('semicolon', 'insertion', function (e, t, n, r, i) {
                if (i === ';') {
                    var s = n.getCursorPosition(), o = r.doc.getLine(s.row), u = o.substring(s.column, s.column + 1);
                    if (u === ';')
                        return {
                            text: '',
                            selection: [
                                1,
                                1
                            ]
                        };
                }
            });
        };
    r.inherits(u, s), t.CssBehaviour = u;
}), define('ace/mode/folding/cstyle', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/range',
    'ace/mode/folding/fold_mode'
], function (e, t, n) {
    'use strict';
    var r = e('../../lib/oop'), i = e('../../range').Range, s = e('./fold_mode').FoldMode, o = t.FoldMode = function (e) {
            e && (this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, '|' + e.start)), this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, '|' + e.end)));
        };
    r.inherits(o, s), function () {
        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/, this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/, this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/, this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/, this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/, this._getFoldWidgetBase = this.getFoldWidget, this.getFoldWidget = function (e, t, n) {
            var r = e.getLine(n);
            if (this.singleLineBlockCommentRe.test(r) && !this.startRegionRe.test(r) && !this.tripleStarBlockCommentRe.test(r))
                return '';
            var i = this._getFoldWidgetBase(e, t, n);
            return !i && this.startRegionRe.test(r) ? 'start' : i;
        }, this.getFoldWidgetRange = function (e, t, n, r) {
            var i = e.getLine(n);
            if (this.startRegionRe.test(i))
                return this.getCommentRegionBlock(e, i, n);
            var s = i.match(this.foldingStartMarker);
            if (s) {
                var o = s.index;
                if (s[1])
                    return this.openingBracketBlock(e, s[1], n, o);
                var u = e.getCommentFoldRange(n, o + s[0].length, 1);
                return u && !u.isMultiLine() && (r ? u = this.getSectionRange(e, n) : t != 'all' && (u = null)), u;
            }
            if (t === 'markbegin')
                return;
            var s = i.match(this.foldingStopMarker);
            if (s) {
                var o = s.index + s[0].length;
                return s[1] ? this.closingBracketBlock(e, s[1], n, o) : e.getCommentFoldRange(n, o, -1);
            }
        }, this.getSectionRange = function (e, t) {
            var n = e.getLine(t), r = n.search(/\S/), s = t, o = n.length;
            t += 1;
            var u = t, a = e.getLength();
            while (++t < a) {
                n = e.getLine(t);
                var f = n.search(/\S/);
                if (f === -1)
                    continue;
                if (r > f)
                    break;
                var l = this.getFoldWidgetRange(e, 'all', t);
                if (l) {
                    if (l.start.row <= s)
                        break;
                    if (l.isMultiLine())
                        t = l.end.row;
                    else if (r == f)
                        break;
                }
                u = t;
            }
            return new i(s, o, u, e.getLine(u).length);
        }, this.getCommentRegionBlock = function (e, t, n) {
            var r = t.search(/\s*$/), s = e.getLength(), o = n, u = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/, a = 1;
            while (++n < s) {
                t = e.getLine(n);
                var f = u.exec(t);
                if (!f)
                    continue;
                f[1] ? a-- : a++;
                if (!a)
                    break;
            }
            var l = n;
            if (l > o)
                return new i(o, r, l, t.length);
        };
    }.call(o.prototype);
}), define('ace/mode/mask', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/mask_highlight_rules',
    'ace/mode/matching_brace_outdent',
    'ace/mode/behaviour/css',
    'ace/mode/folding/cstyle'
], function (e, t, n) {
    'use strict';
    var r = e('../lib/oop'), i = e('./text').Mode, s = e('./mask_highlight_rules').MaskHighlightRules, o = e('./matching_brace_outdent').MatchingBraceOutdent, u = e('./behaviour/css').CssBehaviour, a = e('./folding/cstyle').FoldMode, f = function () {
            this.HighlightRules = s, this.$outdent = new o(), this.$behaviour = new u(), this.foldingRules = new a();
        };
    r.inherits(f, i), function () {
        this.lineCommentStart = '//', this.blockComment = {
            start: '/*',
            end: '*/'
        }, this.getNextLineIndent = function (e, t, n) {
            var r = this.$getIndent(t), i = this.getTokenizer().getLineTokens(t, e).tokens;
            if (i.length && i[i.length - 1].type == 'comment')
                return r;
            var s = t.match(/^.*\{\s*$/);
            return s && (r += n), r;
        }, this.checkOutdent = function (e, t, n) {
            return this.$outdent.checkOutdent(t, n);
        }, this.autoOutdent = function (e, t, n) {
            this.$outdent.autoOutdent(t, n);
        }, this.$id = 'ace/mode/mask';
    }.call(f.prototype), t.Mode = f;
});