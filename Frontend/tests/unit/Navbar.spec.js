import { createLocalVue, mount } from '@vue/test-utils';
import Buefy from 'buefy';
import VueRouter from 'vue-router';
import Navbar from '@/components/Navbar.vue';

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'landingPage',
    component: Navbar,
  },
  {
    path: '/dialog',
    name: 'dialog',
    component: Navbar,
  },
];
const router = new VueRouter({
  routes,
});

function factory() {
  return mount(Navbar, {
    localVue,
    router,
  });
}


describe('Navbar.vue', () => {
  describe('Elements are rendered correctly', () => {
    it('Component renders', () => {
      const wrapper = factory();
      expect(wrapper).toMatchSnapshot();
    });

    it('Nav items render', () => {
      const wrapper = factory();
      expect(wrapper.findAll('.navbar-item').length).toBe(8);
    });
  });

  describe('Computed return expected value', () => {
    it('currentRoute works', () => {
      const wrapper = factory();
      expect(wrapper.vm.currentRoute).toBe(routes[0].name);
    });
  });

  describe('methods work', () => {
    it('sound can be muted', () => {
      const wrapper = factory();
      wrapper.vm.muteSound();
      expect(localStorage.getItem('soundEnabled')).toBe('false');
    });

    it('sound can be unmuted', () => {
      const wrapper = factory();
      wrapper.vm.unmuteSound();
      expect(localStorage.getItem('soundEnabled')).toBe('true');
    });
  });
});
