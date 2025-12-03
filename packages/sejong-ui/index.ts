import Input from './src/Input';
import Button from './src/Button';
import Select from './src/Select';
import Modal from './src/modal';
import DataTable from './src/dataTable';
import SectionHeader from './src/SectionHeader';
import Tab from './src/Tab';
import AsideMenu from './src/asideMenu';
import './src/index.css';

const SejongUI = {
  Input,
  Button,
  Select,
  Modal,
  SectionHeader,
  Tab,
  AsideMenu,
  DataTable,
};

export default SejongUI;

export type { IMenu } from './src/asideMenu';
export type { ITab } from './src/Tab';
export type { ColumnDefinition } from './src/dataTable/types';
