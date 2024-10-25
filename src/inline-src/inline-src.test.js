import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import {InlineSrc} from "./inline-src"

beforeAll(() => {

    vi.mock('lilconfig', () => ({
        lilconfig: vi.fn().mockImplementation(() => ({
            search: vi.fn(async () => {})
        }))
        .mockImplementationOnce(() => ({
            search: vi.fn(async () => { return {isEmpty : true}})
        }))
        .mockImplementationOnce(() => ({
            search: vi.fn(async () => { return undefined})
        }))
        .mockImplementationOnce(() => ({
            search: vi.fn(async () => { return {filePath: undefined}})
        }))
    }));
})

afterAll(() => {
    vi.restoreAllMocks();
})

describe("InlineSrc", () => {
    it("throws an error if the config file is empty", async () => {
        await expect(() => InlineSrc()).rejects.toThrow(`inline-src: Config file is empty.`)
    })

    it("throws an error if the config result is a rejection or undefined", async () => {
        await expect(() => InlineSrc()).rejects.toThrow(`inline-src: Config file not found.`)
    })

    it("throws an error if the config result contains an uresolved or undefined filePath", async () => {
        await expect(() => InlineSrc()).rejects.toThrow(`inline-src: Config file not found.`)
    })
})