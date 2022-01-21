import Axios, { AxiosRequestConfig } from 'axios';
import URLBuilder from '../../src/tools/URLBuilder';

/**
 * This test may be used as a part of a monitoring process.
 * It can be used in a pipeline which executes only this test every 15 minutes in order to check whether application is still up.
 * */
describe('App endpoint monitoring test', () => {
  let axiosParams: AxiosRequestConfig<any>;

  beforeAll(async () => {
    const urlBuilder = new URLBuilder();
    const baseUrl = urlBuilder.getURL();

    axiosParams = {
      method: 'HEAD',
      url: baseUrl.href
    };
  });

  it('Should check if server connection is up', async () => {
    const res = await Axios.request(axiosParams);
    expect(res.status).toBe(200);
  });
});
