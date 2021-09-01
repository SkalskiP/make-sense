import {DrawUtil} from '../DrawUtil';

describe('DrawUtil hexToRGB method', () => {
    it('should return correct white rgb value when alpha is null', () => {
        // given
        const hex = '#ffffff'
        // when
        const result = DrawUtil.hexToRGB(hex)
        // then
        expect(result).toEqual('rgb(255, 255, 255)');
    })

    it('should return correct black rgb value when alpha is null', () => {
        // given
        const hex = '#000000'
        // when
        const result = DrawUtil.hexToRGB(hex)
        // then
        expect(result).toEqual('rgb(0, 0, 0)');
    })

    it('should return correct rgba value when alpha is null', () => {
        // given
        const hex = '#000000'
        const alpha = 0.5
        // when
        const result = DrawUtil.hexToRGB(hex, alpha)
        // then
        expect(result).toEqual('rgba(0, 0, 0, 0.5)');
    })
})
