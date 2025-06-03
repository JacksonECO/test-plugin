"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GuardianCoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianCoreService = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const options_dto_1 = require("../options.dto");
const resume_erro_core_1 = require("../util/resume-erro-core");
let GuardianCoreService = GuardianCoreService_1 = class GuardianCoreService {
    guardianOptions;
    logger = new common_1.Logger(GuardianCoreService_1.name);
    constructor(guardianOptions) {
        this.guardianOptions = guardianOptions;
    }
    async salvaRequest(request) {
        return this.sendRequest({
            topLeft: request.agencia ?? '',
            topRight: 'Banco: ' + this.guardianOptions.codigoBanco,
            title: request.title,
            info: {
                Url: request.url,
            },
            detalhes: {
                Erro: request.message,
                JSON: JSON.stringify(request.body ?? {}),
            },
        });
    }
    async enviarErro(erroDto) {
        return this.sendRequest({
            topLeft: erroDto.agencia ? 'Agência: ' + erroDto.agencia : 'Sem agência informada',
            topRight: 'Banco: ' + this.guardianOptions.codigoBanco,
            title: erroDto.mensagem,
            detalhes: {
                Erro: JSON.stringify(erroDto),
            },
        });
    }
    async send(message) {
        if (!message.topLeft && message.agencia) {
            message.topLeft = 'Agência: ' + message.agencia;
        }
        else if (!message.topLeft && !message.agencia) {
            message.topLeft = 'Sem agência informada';
        }
        if (!message.topRight) {
            message.topRight = 'Banco: ' + this.guardianOptions.codigoBanco;
        }
        if (message.error) {
            message.detalhes = message.detalhes || {};
            message.detalhes['_Erro'] = (0, resume_erro_core_1.resumeErrorCore)(message.error);
        }
        return this.sendRequest(message);
    }
    async sendRequest({ topLeft, topRight, headerText = 'Olá Dev! ' + this.guardianOptions.nameSystem, title, titleColor = 'Warning', info, textDetail = 'Detalhes', detalhes: details, }) {
        try {
            const json = {
                type: 'message',
                attachments: [
                    {
                        contentType: 'application/vnd.microsoft.card.adaptive',
                        contentUrl: null,
                        content: {
                            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                            type: 'AdaptiveCard',
                            version: '1.6',
                            body: [
                                {
                                    type: 'ColumnSet',
                                    style: 'emphasis',
                                    columns: [
                                        {
                                            type: 'Column',
                                            items: [
                                                {
                                                    type: 'TextBlock',
                                                    text: topLeft,
                                                    wrap: true,
                                                },
                                            ],
                                            width: 'stretch',
                                            padding: 'Medium',
                                        },
                                        {
                                            type: 'Column',
                                            items: [
                                                {
                                                    type: 'TextBlock',
                                                    horizontalAlignment: 'Center',
                                                    color: 'Accent',
                                                    text: topRight,
                                                    wrap: true,
                                                },
                                            ],
                                            width: 'stretch',
                                            padding: 'Medium',
                                        },
                                    ],
                                    padding: 'Medium',
                                    spacing: 'Large',
                                },
                                {
                                    type: 'Container',
                                    items: [
                                        {
                                            type: 'TextBlock',
                                            size: 'Large',
                                            weight: 'Bolder',
                                            text: headerText,
                                            style: 'heading',
                                            spacing: 'None',
                                            wrap: true,
                                        },
                                    ],
                                    padding: 'Large',
                                    spacing: 'Large',
                                    separator: true,
                                },
                                {
                                    type: 'Container',
                                    id: '7d00f965-40bb-9fc3-ff7b-a9b82a09ead4',
                                    padding: 'Medium',
                                    items: [
                                        {
                                            type: 'ColumnSet',
                                            columns: [
                                                {
                                                    type: 'Column',
                                                    items: [
                                                        {
                                                            type: 'Image',
                                                            style: 'Person',
                                                            url: 'https://cdn-icons-png.flaticon.com/512/4712/4712010.png',
                                                            size: 'Small',
                                                            altText: 'Guardião',
                                                            id: 'guardiao',
                                                        },
                                                    ],
                                                    width: 'auto',
                                                    padding: 'Medium',
                                                },
                                                {
                                                    type: 'Column',
                                                    items: [
                                                        {
                                                            type: 'TextBlock',
                                                            text: 'Guardião',
                                                            wrap: true,
                                                        },
                                                        {
                                                            type: 'TextBlock',
                                                            spacing: 'None',
                                                            color: 'Light',
                                                            text: 'Bot de verificação de erros.',
                                                            size: 'Small',
                                                            horizontalAlignment: 'Left',
                                                            wrap: true,
                                                        },
                                                    ],
                                                    width: 'stretch',
                                                    padding: 'Medium',
                                                },
                                            ],
                                            spacing: 'Large',
                                            padding: 'Medium',
                                        },
                                    ],
                                    spacing: 'Large',
                                    separator: true,
                                },
                                {
                                    type: 'Container',
                                    items: [
                                        {
                                            type: 'TextBlock',
                                            text: title,
                                            color: titleColor,
                                            wrap: true,
                                        },
                                        ...(info && Object.keys(info).length > 0
                                            ? [
                                                {
                                                    type: 'FactSet',
                                                    id: 'a46a50e6-11c3-27bb-349f-b40d820a7b83',
                                                    facts: Object.keys(info).map((key) => ({
                                                        title: key,
                                                        value: info[key] ? info[key].toString() : '-',
                                                    })),
                                                },
                                            ]
                                            : []),
                                    ],
                                    padding: {
                                        top: 'None',
                                        bottom: 'Default',
                                        left: 'Default',
                                        right: 'Default',
                                    },
                                    spacing: 'Large',
                                },
                                ...(details && Object.keys(details).length > 0
                                    ? [
                                        {
                                            type: 'Container',
                                            spacing: 'Large',
                                            items: [
                                                {
                                                    type: 'Container',
                                                    id: 'b149e1cc-0414-662b-6435-ad68d851bf67',
                                                    padding: 'Default',
                                                    spacing: 'Large',
                                                    style: 'emphasis',
                                                    separator: true,
                                                    selectAction: {
                                                        type: 'Action.ToggleVisibility',
                                                        targetElements: [
                                                            'ActivityHistoryWrapper',
                                                            'ActivityHistoryChevronUp',
                                                            'ActivityHistoryChevronDown',
                                                        ],
                                                        id: 'ExpandActivityHistory',
                                                        title: 'Expand Activity History',
                                                    },
                                                    items: [
                                                        {
                                                            type: 'ColumnSet',
                                                            columns: [
                                                                {
                                                                    type: 'Column',
                                                                    width: 'stretch',
                                                                    items: [
                                                                        {
                                                                            type: 'TextBlock',
                                                                            weight: 'Bolder',
                                                                            text: textDetail,
                                                                            wrap: true,
                                                                            spacing: 'Large',
                                                                            horizontalAlignment: 'Left',
                                                                        },
                                                                    ],
                                                                },
                                                                {
                                                                    type: 'Column',
                                                                    items: [
                                                                        {
                                                                            type: 'ImageSet',
                                                                            images: [
                                                                                {
                                                                                    type: 'Image',
                                                                                    size: 'Medium',
                                                                                    url: 'https://amdesigner.azurewebsites.net/samples/assets/Down.png',
                                                                                    spacing: 'Small',
                                                                                    height: '15px',
                                                                                },
                                                                            ],
                                                                        },
                                                                    ],
                                                                    spacing: 'Small',
                                                                    height: 'stretch',
                                                                    width: '30px',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                {
                                                    type: 'Container',
                                                    id: 'ActivityHistoryWrapper',
                                                    items: Object.keys(details).map((key) => ({
                                                        type: 'TextBlock',
                                                        spacing: 'Large',
                                                        color: 'Default',
                                                        wrap: true,
                                                        text: key +
                                                            ': ' +
                                                            (typeof details[key] === 'string' || typeof details[key] === 'number'
                                                                ? details[key]
                                                                : JSON.stringify(details[key] ?? {})),
                                                    })),
                                                    padding: {
                                                        top: 'Default',
                                                        bottom: 'Large',
                                                        left: 'Default',
                                                        right: 'Default',
                                                    },
                                                    spacing: 'Large',
                                                    separator: true,
                                                    isVisible: false,
                                                },
                                            ],
                                            padding: 'None',
                                            separator: true,
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    },
                ],
            };
            await axios_1.default.post(this.guardianOptions.url, json);
        }
        catch (error) {
            this.logger.fatal('Erro ao enviar mensagem para o Teams\n' +
                topLeft +
                ' - ' +
                topRight +
                '\n' +
                title +
                '\n' +
                'info: ' +
                JSON.stringify(info ?? {}) +
                '\n' +
                'detalhes: ' +
                JSON.stringify(details ?? {}));
            this.logger.error('Request', (0, resume_erro_core_1.resumeErrorCore)(error));
        }
    }
};
exports.GuardianCoreService = GuardianCoreService;
exports.GuardianCoreService = GuardianCoreService = GuardianCoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.CORE_GUARDIAN_OPTION)),
    __metadata("design:paramtypes", [options_dto_1.GuardianOptions])
], GuardianCoreService);
//# sourceMappingURL=guardian-core.service.js.map