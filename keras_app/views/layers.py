import math


def Input(layer):
    params = {}
    shape = layer.batch_input_shape
    if (len(shape) == 2):
        params['dim'] = str([1, shape[1]])[1:-1]
    else:
        params['dim'] = str([1, shape[3], shape[1], shape[2]])[1:-1]
    return jsonLayer('Input', params, layer)


def Convolution(layer):
    params = {}
    params['kernel_w'], params['kernel_h'] = layer.kernel_size
    params['stride_w'], params['stride_h'] = layer.strides
    params['pad_w'], params['pad_h'] = get_padding(params['kernel_w'], params['kernel_h'],
                                                   params['stride_w'], params['stride_h'],
                                                   layer.padding.lower())
    params['weight_filler'] = layer.kernel_initializer.__class__.__name__
    params['bias_filler'] = layer.bias_initializer.__class__.__name__
    params['num_output'] = layer.filters
    return jsonLayer('Convolution', params, layer)


def Deconvolution(layer):
    params = {}
    params['kernel_w'], params['kernel_h'] = layer.kernel_size
    params['stride_w'], params['stride_h'] = layer.strides
    params['pad_w'], params['pad_h'] = get_padding(params['kernel_w'], params['kernel_h'],
                                                   params['stride_w'], params['stride_h'],
                                                   layer.padding.lower())
    params['weight_filler'] = layer.kernel_initializer.__class__.__name__
    params['bias_filler'] = layer.bias_initializer.__class__.__name__
    params['num_output'] = layer.filters
    return jsonLayer('Deconvolution', params, layer)


def Pooling(layer):
    params = {}
    poolMap = {
        'MaxPooling2D': 0,
        'AveragePooling2D': 1,
        'GlobalAveragePooling2D': 1
    }
    if (layer.__class__.__name__ == 'GlobalAveragePooling2D'):
        input_shape = layer.input_shape
        params['kernel_w'] = params['stride_w'] = input_shape[2]
        params['kernel_h'] = params['stride_h'] = input_shape[1]
        padding = 'valid'
    else:
        params['kernel_w'], params['kernel_h'] = layer.pool_size
        params['stride_w'], params['stride_h'] = layer.strides
        padding = layer.padding.lower()
    params['pad_w'], params['pad_h'] = get_padding(params['kernel_w'], params['kernel_h'],
                                                   params['stride_w'], params['stride_h'],
                                                   padding)
    params['pool'] = poolMap[layer.__class__.__name__]
    return jsonLayer('Pooling', params, layer)


def Flatten(layer):
    return jsonLayer('Flatten', {}, layer)


def Dropout(layer):
    return jsonLayer('Dropout', {}, layer)


def Reshape(layer):
    params = {}
    shape = layer.target_shape
    params['dim'] = str([1, shape[2], shape[0], shape[1]])[1:-1]
    return jsonLayer('Reshape', params, layer)


def Concat(layer):
    return jsonLayer('Concat', {}, layer)


def Dense(layer):
    params = {}
    params['weight_filler'] = layer.kernel_initializer.__class__.__name__
    params['bias_filler'] = layer.bias_initializer.__class__.__name__
    params['num_output'] = layer.units
    return jsonLayer('InnerProduct', params, layer)


def Activation(layer):
    activationMap = {
        'softmax': 'Softmax',
        'elu': 'ELU',
        'relu': 'ReLU',
        'tanh': 'TanH',
        'sigmoid': 'Sigmoid'
    }
    if (layer.__class__.__name__ == 'Activation'):
        return jsonLayer(activationMap[layer.activation.func_name], {}, layer)
    else:
        tempLayer = {}
        tempLayer['inbound_nodes'] = [[[layer.name + layer.__class__.__name__]]]
        return jsonLayer(activationMap[layer.activation.func_name], {}, tempLayer)


def Eltwise(layer):
    eltwiseMap = {
        'Add': 1,
        'Multiply': 0,
        'Maximum': 2
    }
    params = {'operation': eltwiseMap[layer.__class__.__name__]}
    return jsonLayer('Eltwise', params, layer)


def Scale(layer):
    tempLayer = {}
    params = {'bias_term': layer.center}
    tempLayer['inbound_nodes'] = [[[layer.name+layer.__class__.__name__]]]
    return jsonLayer('Scale', params, tempLayer)


def Padding(layer):
    pad = layer.padding
    params = {'pad_h': pad[0][0], 'pad_w': pad[1][0]}
    return jsonLayer('Pad', params, layer)


def BatchNorm(layer):
    params = {}
    params['eps'] = layer.epsilon
    params['moving_average_fraction'] = layer.momentum
    return jsonLayer('BatchNorm', params, layer)


def get_padding(k_w, k_h, s_w, s_h, pad_type):
    if (pad_type == 'valid'):
        return [0, 0]
    else:
        if (s_w != 1 or s_h != 1):
            raise Exception('Cannot calculate padding for stride '+str((s_w, s_h)))
        else:
            return (math.ceil((k_w-1)/2), math.ceil((k_h-1)/2))


def jsonLayer(type, params, layer):
    input = []
    if isinstance(layer, dict):
        for node in layer['inbound_nodes'][0]:
            input.append(node[0])
    elif (len(layer.inbound_nodes[0].inbound_layers)):
        for node in layer.inbound_nodes[0].inbound_layers:
            input.append(node.name)
    layer = {
                'info': {
                    'type': type,
                    'phase': None
                },
                'connection': {
                    'input': input,
                    'output': []
                },
                'params': params
            }
    return layer
