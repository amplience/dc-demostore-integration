import { paginate } from './pagination'

describe('paginate', function() {

	const getPageMock = (total: number) => (page: number, pageSize: number) => {
		const pageBase = page * pageSize
		const remaining = Math.max(0, total - pageBase)
		return Promise.resolve({ data: Array.from({length: Math.min(pageSize, remaining)}).map((_, index) => index + pageBase), total })
	}

	test('paginate 0 items', async () => {
		const getPage = jest.fn().mockImplementation(() => Promise.resolve({ data: [], total: 0 }))

		const result = await paginate(getPage, 20, 0)

		expect(getPage).toHaveBeenCalledWith(0, 20)
		expect(result).toEqual([])
	})

	test('paginate 1 item', async () => {
		const getPage = jest.fn().mockImplementation(() => Promise.resolve({ data: [1], total: 1 }))

		const result = await paginate(getPage, 20, 0)

		expect(getPage).toHaveBeenCalledWith(0, 20)
		expect(result).toEqual([1])
	})

	test('paginate 2 pages', async () => {
		const total = 30
		const getPage = jest.fn().mockImplementation((page: number, pageSize: number) => {
			const pageBase = page * pageSize
			const remaining = Math.max(0, total - pageBase)
			return Promise.resolve({ data: Array.from({length: Math.min(pageSize, remaining)}).map((_, index) => index + pageBase), total })
		})

		const result = await paginate(getPage, 20, 0)

		expect(getPage).toHaveBeenCalledWith(0, 20)
		expect(getPage).toHaveBeenCalledWith(1, 20)
		expect(result).toEqual(Array.from({length: total}).map((_, index) => index))
	})

	test('paginate 20 pages', async () => {
		const total = 390
		const getPage = jest.fn().mockImplementation(getPageMock(total))

		const result = await paginate(getPage, 20, 0)

		for (let i = 0; i < 20; i++){
			expect(getPage).toHaveBeenCalledWith(i, 20)
		}

		expect(result).toEqual(Array.from({length: total}).map((_, index) => index))
	})

	test('paginate 10 items from last page', async () => {
		const total = 390
		const getPage = jest.fn().mockImplementation(getPageMock(total))

		const result = await paginate(getPage, 20, 19, 1)

		expect(getPage).toHaveBeenCalledWith(19, 20)

		expect(result).toEqual(Array.from({length: 10}).map((_, index) => index + 380))
	})

	test('paginate page 10-20 of 30', async () => {
		const total = 600
		const getPage = jest.fn().mockImplementation(getPageMock(total))

		const result = await paginate(getPage, 20, 10, 10)

		for (let i = 10; i < 20; i++){
			expect(getPage).toHaveBeenCalledWith(i, 20)
		}

		expect(result).toEqual(Array.from({length: 200}).map((_, index) => index + 200))
	})
});