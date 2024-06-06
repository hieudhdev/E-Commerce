const StringJoiMessages = {
    'string.alphanum': '{{#label}} chỉ được chứa các ký tự chữ và số',
    'string.base': '{{#label}} phải là một chuỗi',
    'string.base64': '{{#label}} phải là một chuỗi base64 hợp lệ',
    'string.creditCard': '{{#label}} phải là một thẻ tín dụng',
    'string.dataUri': '{{#label}} phải là một chuỗi dataUri hợp lệ',
    'string.domain': '{{#label}} phải chứa tên miền hợp lệ',
    'string.email': '{{#label}} phải là một địa chỉ email hợp lệ',
    'string.empty': '{{#label}} không được để trống',
    'string.guid': '{{#label}} phải là một GUID hợp lệ',
    'string.hex': '{{#label}} chỉ được chứa các ký tự hexa',
    'string.hexAlign': '{{#label}} phải có biểu diễn giải mã hexa phải được căn chỉnh theo byte',
    'string.hostname': '{{#label}} phải là một tên miền hợp lệ',
    'string.ip': '{{#label}} phải là một địa chỉ IP hợp lệ với CIDR {{#cidr}}',
    'string.ipVersion': '{{#label}} phải là một địa chỉ IP hợp lệ của một trong các phiên bản sau {{#version}} với CIDR {{#cidr}}',
    'string.isoDate': '{{#label}} phải có định dạng iso',
    'string.isoDuration': '{{#label}} phải là một độ dài ISO 8601 hợp lệ',
    'string.length': '{{#label}} phải có độ dài {{#limit}} ký tự',
    'string.lowercase': '{{#label}} chỉ được chứa các ký tự viết thường',
    'string.max': '{{#label}} không được vượt quá {{#limit}} ký tự',
    'string.min': '{{#label}} phải có ít nhất {{#limit}} ký tự',
    'string.normalize': '{{#label}} phải được chuẩn hóa unicode dưới dạng {{#form}}',
    'string.token': '{{#label}} chỉ được chứa các ký tự chữ, số và dấu gạch dưới',
    'string.pattern.base': '{{#label}} với giá trị {:[.]} không khớp với mẫu yêu cầu: {{#regex}}',
    'string.pattern.name': '{{#label}} với giá trị {:[.]} không khớp với mẫu {{#name}}',
    'string.pattern.invert.base': '{{#label}} với giá trị {:[.]} khớp với mẫu đảo ngược: {{#regex}}',
    'string.pattern.invert.name': '{{#label}} với giá trị {:[.]} khớp với mẫu đảo ngược {{#name}}',
    'string.trim': '{{#label}} không được có khoảng trắng đầu hoặc cuối chuỗi',
    'string.uri': '{{#label}} phải là một URI hợp lệ',
    'string.uriCustomScheme': '{{#label}} phải là một URI hợp lệ với một scheme phù hợp với mẫu {{#scheme}}',
    'string.uriRelativeOnly': '{{#label}} phải là một URI tương đối hợp lệ',
    'string.uppercase': '{{#label}} chỉ được chứa các ký tự viết hoa'
}

const NumberJoiMessages = {
    'number.base': '{{#label}} phải là một số',
    'number.greater': '{{#label}} phải lớn hơn {{#limit}}',
    'number.infinity': '{{#label}} không thể là vô cực',
    'number.integer': '{{#label}} phải là một số nguyên',
    'number.less': '{{#label}} phải nhỏ hơn {{#limit}}',
    'number.max': '{{#label}} phải nhỏ hơn hoặc bằng {{#limit}}',
    'number.min': '{{#label}} phải lớn hơn hoặc bằng {{#limit}}',
    'number.multiple': '{{#label}} phải là bội số của {{#multiple}}',
    'number.negative': '{{#label}} phải là một số âm',
    'number.port': '{{#label}} phải là một cổng hợp lệ',
    'number.positive': '{{#label}} phải là một số dương',
    'number.precision': '{{#label}} không được có nhiều hơn {{#limit}} chữ số thập phân',
    'number.unsafe': '{{#label}} phải là một số an toàn'
};

module.exports = {
    StringJoiMessages,
    NumberJoiMessages
}

