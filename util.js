module.exports = {
  formatTime: formatTime, 
  msg: msg,
  alert:alert,
  isEmpty: isEmpty,
  formatString: formatString,
  trim: trim,
  defaultIfEmpty: defaultIfEmpty,  
  idCard:idCard
}


function isEmpty(obj) {
  return obj == "" || obj == undefined || obj == null || obj == "null";
}
function isNotEmpty(obj) {
  return !isEmpty(obj);
}
function trim(str, delString) {
  if (isEmpty(str)) {
    str = "";
  } else {
    delString = defaultIfEmpty(delString, "\\s");
    str += "";
    var trimLeft = new RegExp("^" + delString + "+", "gim");
    var trimRight = new RegExp(delString + "+$", "gim");
    str = str.replace(trimLeft, "").replace(trimRight, "");
  }
  return str;
}
function defaultIfEmpty(obj, defaultObj) {
  return isEmpty(obj) ? defaultObj : obj;
}
function msg(title, icon, duration) {
  icon = defaultIfEmpty(icon, "success");
  duration = defaultIfEmpty(duration, 1000);
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  })
}
function alert(title, content){
  title = defaultIfEmpty(title, '��ʾ')
  wx.showModal({
    title: title,
    content: content,
    showCancel:false
  })
}

function loadingMsg(title, mask) {
  wx.showLoading({
    title: title,
    mask: defaultIfEmpty(mask, true)
  })
}

function formatString(source, params) {
  if (isEmpty(params) || params.length==0) {
    return source
  }  
  if (params.constructor !== Array) {
    params = [params]
  }
  params.forEach(function (n, i) {
    source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
      return n
    })
  })
  return source
}


function idCard(idNum) {
  var errors = new Array(
    "��֤ͨ��",
    "���֤����λ������",
    "���֤���зǷ��ַ�",
    "���֤����У�����",
    "���֤�����Ƿ�"
  );
  //��ݺ���λ������ʽ����
  var re;
  var len = idNum.length;
  //���֤λ������
  if (len != 15 && len != 18) {
    return errors[1];
  }
  else if (len == 15) {
    re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/);
  }
  else {
    re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})([0-9xX])$/);
  }

  var area = {
    11: "����", 12: "���", 13: "�ӱ�", 14: "ɽ��",
    15: "���ɹ�", 21: "����", 22: "����", 23: "������", 31: "�Ϻ�",
    32: "����", 33: "�㽭", 34: "����", 35: "����", 36: "����",
    37: "ɽ��", 41: "����", 42: "����", 43: "����", 44: "�㶫",
    45: "����", 46: "����", 50: "����", 51: "�Ĵ�", 52: "����",
    53: "����", 54: "����", 61: "����", 62: "����", 63: "�ຣ",
    64: "����", 65: "�½�", 71: "̨��", 81: "���", 82: "����",
    91: "����"
  }

  var idcard_array = new Array();
  idcard_array = idNum.split("");

  //��������
  if (area[parseInt(idNum.substr(0, 2))] == null) {
    return errors[4];
  }
  //����������ȷ�Լ���
  var a = idNum.match(re);

  if (a != null) {
    if (len == 15) {
      var DD = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
      var flag = DD.getYear() == a[3] && (DD.getMonth() + 1) == a[4] && DD.getDate() == a[5];
    }
    else if (len == 18) {
      var DD = new Date(a[3] + "/" + a[4] + "/" + a[5]);
      var flag = DD.getFullYear() == a[3] && (DD.getMonth() + 1) == a[4] && DD.getDate() == a[5];
    }

    if (!flag) {
      return "���֤�������ڲ��ԣ�";
    }

    //����У��λ
    if (len == 18) {
      var S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
        + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
        + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
        + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
        + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
        + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
        + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
        + parseInt(idcard_array[7]) * 1
        + parseInt(idcard_array[8]) * 6
        + parseInt(idcard_array[9]) * 3;

      var Y = S % 11;
      var M = "F";
      var JYM = "10X98765432";
      var M = JYM.substr(Y, 1);//�ж�У��λ

      //���ID��У��λ
      if (M == idcard_array[17]) {
        return "";
      }
      else {
        return errors[3];
      }
    }

  }
  else {
    return errors[2];
  }
  return "";
}