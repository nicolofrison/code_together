import Code from '../../src/models/entities/Code';
import { codeService } from '../../src/services/code.service';
import { codeRepository } from '../../src/repositories/code.repository';
import RecordNotFoundError from '../../src/models/exceptions/RecordNotFoundError';

describe('CodeService', () => {
  jest.mock('../../src/repositories/code.repository', () => jest.fn());

  describe('findById', () => {
    test('findById code found', async () => {
      const expectedCode = new Code('code name', 30);
      codeRepository.findOneBy = jest.fn(() => Promise.resolve(expectedCode));

      const code = await codeService.findById(1);
      expect(code).toBe(expectedCode);
    });

    test('findById code not found throws RecordNotFoundError', async () => {
      codeRepository.findOneBy = jest.fn(() => Promise.resolve(null));

      await expect(codeService.findById(1)).rejects.toThrow(
        RecordNotFoundError
      );
    });
  });
});
