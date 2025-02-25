/*
 * The Alluxio Open Foundation licenses this work under the Apache License, version 2.0
 * (the "License"). You may not use this work except in compliance with the License, which is
 * available at www.apache.org/licenses/LICENSE-2.0
 *
 * This software is distributed on an "AS IS" basis, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied, as more fully set forth in the License.
 *
 * See the NOTICE file distributed with this work for information regarding copyright ownership.
 */

import { configure, shallow, ShallowWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createBrowserHistory, History, LocationState } from 'history';
import React from 'react';
import sinon from 'sinon';

import { initialState } from '../../../store';
import { initialInitState } from '../../../store/init/reducer';
import { AllProps, WorkersPresenter } from './Workers';
import { routePaths } from '../../../constants';
import { createAlertErrors } from '@alluxio/common-ui/src/utilities';

configure({ adapter: new Adapter() });

describe('Workers', () => {
  let history: History<LocationState>;
  let props: AllProps;

  beforeAll(() => {
    history = createBrowserHistory({ keyLength: 0 });
    history.push(routePaths.workers);
    props = {
      initData: initialInitState.data,
      workersData: initialState.workers.data,
      errors: createAlertErrors(false),
      loading: false,
      refresh: initialState.refresh.data,
      class: '',
      fetchRequest: sinon.spy(() => {}),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Shallow component', () => {
    let shallowWrapper: ShallowWrapper;

    beforeAll(() => {
      shallowWrapper = shallow(<WorkersPresenter {...props} />);
    });

    it('Renders without crashing', () => {
      expect(shallowWrapper.length).toEqual(1);
    });

    it('Matches snapshot', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('Hostname in Kubernetes environment', () => {
      shallowWrapper.setProps({
        workersData: { ...props.workersData, normalNodeInfos: [{ host: 'hostIp (podIp)', workerId: 1 }] },
      });
      expect(shallowWrapper.find('#id-1').props().children).toEqual('Node Name(Container Host)');
      expect(shallowWrapper.find('#id-1-link').prop('href')).toEqual(`//hostIp:${props.initData.workerPort}`);
    });

    it('Hostname in bare-metal environment', () => {
      shallowWrapper.setProps({
        workersData: { ...props.workersData, normalNodeInfos: [{ host: 'hostIp', workerId: 1 }] },
      });
      expect(shallowWrapper.find('#id-1').props().children).toEqual('Node Name');
      expect(shallowWrapper.find('#id-1-link').prop('href')).toEqual(`//hostIp:${props.initData.workerPort}`);
    });
  });
});
