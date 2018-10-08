/**
* Наследует из существующего класса вебинаров компании абстрактный класс вебинаров по цифровым учебникам, 
* из него наследует классы планиремых вебинаров и прошедших
*/

abstract class WebinarsListDigital extends WebinarsList {

    public function __construct($page = 1, $filter = array(), $limit = 10) {
        $this->_condition .= ' AND "topics.NodId" = 77';
        foreach ($filter as &$value) { $value = intval($value); }
        if (!empty($filter)) {
            $this->_condition .= ' AND "specialization.NodId" IN (' . implode(',' , $filter) . ')';
        }
        parent::__construct($page, $limit);
    }


    /**
     * Возвращает узлы вебинаров
     * @param string $sort Сортировка
     * @return array
     */
    public function nodes($sort = 'desc') {
        $time = date('Y-m-d H:i:s');
        $nodes = s2GetNodes(array(
                'NType' => $this->_pager->getTypes(),
                'mod' => $this->_pager->getModule(),
                'prj' => Application::PROJECT,
                'condition' => $this->_condition,
                'sort' => array(array('date', $sort)),
                'fields' => array('NodId', 'NName', 'date', 'text', 'link.href','link.title','newPlatform','identifier','youtubeKey','dateEnd','leader'),
                'limit' => $this->_pager->getLimit(),
                'offset' => $this->_pager->getOffset(),
        ));
        foreach ($nodes as &$node) {
            $node = self::node($node, $time);
        }
        return $nodes;
    }

    /**
     * Возвращает страницы
     * @return string
     */
    public function getPages() {
        $Pages = [];
        for($x = 1; $x <= $this->getPager()->getCountPages(); $x++){
            $Pages[] = $x;
        }
        return $Pages;
    }
}

//Все планируемые вебинары
class WebinarsListDigitalFuture extends WebinarsListDigital{

    public function __construct($page = 1, $filter = array(), $limit = 10) {
        $this->_condition = '"dateEnd" > \'' . date("Y-m-d H:i:s") . '\'';
        parent::__construct($page, $filter, $limit);
    }
}

//Все прошедшие вебинары
class WebinarsListDigitalArchive extends WebinarsListDigital{
    public function __construct($page = 1, $filter = array(), $limit = 10) {
        $this->_condition = '"dateEnd" <= \'' .date("Y-m-d H:i:s") . '\'';
        parent::__construct($page, $filter, $limit);
    }
}
